import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';

export const submitEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, product, productName, productSku, category, message } = req.body;

    if (!name || !phone) {
      res.status(400).json({ success: false, message: 'Name and phone number are required' });
      return;
    }

    const enquiry = new Enquiry({
      name,
      phone,
      email: email || '',
      product: product || undefined,
      productName: productName || '',
      productSku: productSku || '',
      category: category || '',
      message: message || '',
      status: 'NEW',
    });

    await enquiry.save();
    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. Our showroom specialist will contact you shortly.',
      data: enquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter: any = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }, { productName: searchRegex }];
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate('product', 'name slug images'),
      Enquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    if (status) enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;

    await enquiry.save();
    res.json({ success: true, message: 'Enquiry updated successfully', data: enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
