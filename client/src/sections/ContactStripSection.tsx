import React from 'react';
import { Phone, MessageCircle, Navigation } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

export const ContactStripSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-12 bg-showroom-bg border-t border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#141312] text-[#FAF9F5] p-6 sm:p-10 border border-white/10 rounded-[5px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-showroom-gold block mb-1">
              VISIT US
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Come See Us
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[5px] shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[5px] shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <a
              href={settings.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[5px]"
            >
              <Navigation className="w-3.5 h-3.5 text-showroom-gold" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
