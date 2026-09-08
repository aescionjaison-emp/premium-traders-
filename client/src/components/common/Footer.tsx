import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.js';

export const Footer: React.FC = () => {
  const { settings, navigation } = useSettings();

  const navItems = navigation.items.filter((item) => item.visible);

  return (
    <footer className="bg-[#171615] text-[#FAF9F5] pt-16 pb-12 border-t border-showroom-charcoalLight/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-showroom-charcoalLight">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif tracking-architectural text-xl font-bold uppercase text-white block">
              {settings.businessName || 'AMBROSIA ARCHITECTURAL SHOWROOM'}
            </span>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {settings.footerText ||
                'Curating the finest building and interior materials for architects, designers, and distinguished homeowners.'}
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-bronze block mb-1">
                Direct Contact & WhatsApp
              </span>
              <p className="text-sm font-mono font-bold text-white tracking-wider">
                {settings.phone} / {settings.whatsapp}
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-bronze block">
              Material Disciplines
            </span>
            <ul className="space-y-2 text-xs uppercase font-medium tracking-wider text-white/80">
              <li>
                <Link to="/tiles" className="hover:text-showroom-bronze transition-colors flex items-center justify-between">
                  <span>Large Format Tiles</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                </Link>
              </li>
              <li>
                <Link to="/granite" className="hover:text-showroom-bronze transition-colors flex items-center justify-between">
                  <span>Exotic Granite & Quartzite</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                </Link>
              </li>
              <li>
                <Link to="/wood" className="hover:text-showroom-bronze transition-colors flex items-center justify-between">
                  <span>Teak Entrance Doors & Louvers</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                </Link>
              </li>
              <li>
                <Link to="/electrical" className="hover:text-showroom-bronze transition-colors flex items-center justify-between">
                  <span>Brushed Brass Switches & Lighting</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-bronze block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs uppercase font-medium tracking-wider text-white/80">
              {navItems.map((n, i) => (
                <li key={i}>
                  <Link to={n.url} className="hover:text-showroom-bronze transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom Visit / Location */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-bronze block">
              Flagship Experience
            </span>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-showroom-bronze shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-showroom-bronze shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-showroom-bronze shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-showroom-bronze hover:underline pt-1"
              >
                <span>Get Driving Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 tracking-wider">
          <p>{settings.copyrightText || '© 2026 Ambrosia Architectural Showroom. All Rights Reserved.'}</p>

          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors uppercase">
              Schedule Showroom Visit
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-showroom-bronze transition-colors flex items-center gap-1 uppercase"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
