import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../api/endpoints.js';

export const EnquiryModal: React.FC = () => {
  const { enquiryProduct, isEnquiryOpen, closeEnquiry } = useQuickView();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isEnquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      error('Name and Phone number are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        product: enquiryProduct ? (enquiryProduct._id as any) : undefined,
        productName: enquiryProduct ? enquiryProduct.name : 'General Catalog Inquiry',
        productSku: enquiryProduct ? enquiryProduct.sku : '',
        category: enquiryProduct ? (typeof enquiryProduct.category === 'object' ? enquiryProduct.category.name : '') : '',
        message: message.trim(),
      });

      if (res.data.success) {
        setSubmitted(true);
        success('Enquiry received! Our showroom specialist will contact you.');
        setTimeout(() => {
          setSubmitted(false);
          setName('');
          setPhone('');
          setEmail('');
          setMessage('');
          closeEnquiry();
        }, 2200);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit enquiry. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEnquiry}
          className="fixed inset-0 bg-showroom-charcoal/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-showroom-bg border border-showroom-border shadow-2xl p-6 sm:p-8 z-10 rounded-[5px]"
        >
          <button
            onClick={closeEnquiry}
            className="absolute top-4 right-4 p-2 text-showroom-muted hover:text-showroom-charcoal rounded-[5px]"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-showroom-bronze mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold uppercase text-showroom-charcoal">
                Enquiry Registered
              </h3>
              <p className="text-xs text-showroom-muted mt-1 max-w-xs mx-auto">
                Our architectural materials specialist will get back to you with pricing, samples, and specification sheets.
              </p>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
                Direct Specification Request
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {enquiryProduct ? `Inquire: ${enquiryProduct.name}` : 'Showroom Consultation'}
              </h2>
              {enquiryProduct && (
                <div className="text-xs font-mono text-showroom-muted mt-0.5">
                  SKU: {enquiryProduct.sku} • {enquiryProduct.size} • {enquiryProduct.finish}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ar. Rahul Mehta / Contractor"
                    className="w-full bg-white border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal rounded-[5px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full bg-white border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal rounded-[5px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="architect@studio.com"
                      className="w-full bg-white border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal rounded-[5px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Project Requirements / Quantity (Sq.ft or Pieces)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify approx area in sq.ft, delivery location, or if physical sample visit is required..."
                    className="w-full bg-white border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal rounded-[5px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-[#FAF9F5] text-xs font-bold uppercase tracking-architectural flex items-center justify-center gap-2 transition-all disabled:opacity-50 rounded-[5px]"
                >
                  <Send className="w-4 h-4 text-showroom-bronze" />
                  <span>{isSubmitting ? 'Registering Enquiry...' : 'Submit Request to Showroom'}</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
