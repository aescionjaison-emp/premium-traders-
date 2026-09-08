import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import navigationRoutes from './routes/navigationRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Real Material Images
connectDB().then(() => {
  import('./seeds/syncProducts.js').then(({ syncRealProductImages }) => {
    syncRealProductImages();
  }).catch(err => console.error(err));
});

// Security & Utility Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directory for uploaded media
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Apply global rate limiting to all /api routes
app.use('/api', apiLimiter);

// Health Check & Sync Utility
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/sync-images', async (req, res) => {
  try {
    const { syncRealProductImages } = await import('./seeds/syncProducts.js');
    await syncRealProductImages();
    res.json({ success: true, message: 'All product images synced successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Ambrosia Showroom API running on port ${PORT}`);
});
