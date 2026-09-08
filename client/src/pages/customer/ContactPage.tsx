import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../api/endpoints.js';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Tiles & Slabs');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        category,
        message: message.trim(),
        productName: 'Showroom Visit & General Consultation',
      });

      if (res.data.success) {
        setSubmitted(true);
        success('Consultation request booked! Our showroom specialist will reach out.');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = (settings.whatsapp || '919876543210').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${settings.businessName}, I would like to schedule a showroom visit and speak with an architectural materials consultant.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-showroom-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 mb-8 border-b border-showroom-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
            SHOWROOM EXPERIENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-showroom-charcoal">
            VISIT OUR FLAGSHIP & CONSULT
          </h1>
          <p className="text-xs sm:text-sm text-showroom-muted mt-2 max-w-2xl leading-relaxed">
            Touch and inspect 300+ physical porcelain slabs, natural granite slabs, working switch panels, and handcrafted teak doors in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Contact Info & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-showroom-border space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
                  Physical Gallery
                </span>
                <h3 className="font-serif text-xl font-bold uppercase text-showroom-charcoal mb-2">
                  {settings.businessName}
                </h3>
                <div className="flex items-start gap-3 text-xs text-showroom-charcoalLight mt-3">
                  <MapPin className="w-4 h-4 text-showroom-bronze shrink-0 mt-0.5" />
                  <span>
                    {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-showroom-sand/60 text-xs text-showroom-charcoalLight">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-showroom-bronze shrink-0" />
                  <span>{settings.openingHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-showroom-bronze shrink-0" />
                  <span>Phone: {settings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-showroom-bronze shrink-0" />
                  <span>Email: {settings.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-showroom-sand/60 space-y-2.5">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </button>

                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-3 bg-showroom-sand/50 hover:bg-showroom-sand text-showroom-charcoal text-xs font-bold uppercase tracking-wider border border-showroom-border transition-colors"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Consultation Booking Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-showroom-border">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-14 h-14 text-showroom-bronze mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold uppercase text-showroom-charcoal">
                  Showroom Consultation Registered
                </h3>
                <p className="text-xs text-showroom-muted mt-2 max-w-sm mx-auto">
                  Thank you. Our senior material advisor will contact you shortly to confirm your visit time and arrange material samples.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-6 px-5 py-2.5 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-widest"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
                  ARCHITECT & CLIENT CONSULTATION
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-showroom-charcoal mb-2">
                  BOOK A MATERIAL SPECIFICATION SESSION
                </h2>
                <p className="text-xs text-showroom-muted mb-6">
                  Fill out your project details below to reserve dedicated showroom advisory time with physical sample trays.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Full Name / Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ar. Ananya Roy / Roy Architects"
                      className="w-full bg-showroom-bg border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal"
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
                        placeholder="+91 98765 43210"
                        className="w-full bg-showroom-bg border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="design@studio.com"
                        className="w-full bg-showroom-bg border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Primary Discipline of Interest
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-showroom-bg border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal"
                    >
                      <option value="Tiles & Large Slabs">Tiles & Large Format Porcelain</option>
                      <option value="Granite & Marble Slabs">Exotic Granite & Marble Slabs</option>
                      <option value="Woodworks & Teak Doors">Burma Teak Doors & Acoustic Woodworks</option>
                      <option value="Electrical & Lighting">Luxury Modular Switches & Lighting</option>
                      <option value="Complete Villa / Project Package">Complete Project / Villa Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Project Notes / Timeline / Approx Sq.Ft
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share estimated carpet area, floor plans status, or specific finishes you wish to inspect..."
                      className="w-full bg-showroom-bg border border-showroom-border px-3.5 py-2.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-architectural flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-showroom-bronze" />
                    <span>{isSubmitting ? 'Registering Booking...' : 'Confirm Showroom Consultation Request'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
