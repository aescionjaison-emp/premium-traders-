import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Sparkles,
  LayoutTemplate,
  Image,
  Navigation as NavIcon,
  MessageSquare,
  PhoneCall,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Collections', path: '/admin/collections', icon: Layers },
    { label: 'Brands', path: '/admin/brands', icon: Sparkles },
    { label: 'Homepage Builder', path: '/admin/homepage', icon: LayoutTemplate },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Gallery Showcase', path: '/admin/gallery', icon: Sparkles },
    { label: 'Navigation Menu', path: '/admin/navigation', icon: NavIcon },
    { label: 'Enquiries / Leads', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Contact Details', path: '/admin/contact', icon: PhoneCall },
    { label: 'Site Settings & SEO', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#171615] text-[#FAF9F5] border-r border-showroom-charcoalLight/60 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Branding */}
          <div className="p-6 border-b border-showroom-charcoalLight/60">
            <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
              SHOWROOM CMS
            </span>
            <h2 className="font-serif text-lg font-bold uppercase text-white tracking-tight">
              ADMIN CONTROL
            </h2>
            <div className="text-[11px] text-white/50 font-mono mt-0.5 truncate">
              {user?.email || 'admin@showroom.com'}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.end}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                      isActive
                        ? 'bg-showroom-bronze text-white font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-showroom-charcoalLight/60 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-showroom-bronze" />
            <span>Preview Live Site</span>
          </Link>

          <button
            onClick={logout}
            className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-red-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
