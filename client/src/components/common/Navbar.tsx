import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Menu, X, ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.js';
import { useQuickView } from '../../context/QuickViewContext.js';
import { api } from '../../api/endpoints.js';
import { IProduct } from '../../types/index.js';

export const Navbar: React.FC = () => {
  const { settings, navigation } = useSettings();
  const { openEnquiry } = useQuickView();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.getProducts({ search: searchQuery.trim(), limit: 5 });
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = navigation.items.filter((item) => item.visible);

  return (
    <>
      {/* Ultra-Slim, Low-Profile Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || location.pathname !== '/'
            ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-showroom-border/80 py-2.5 shadow-subtle text-showroom-charcoal'
            : 'bg-black/25 backdrop-blur-md border-b border-white/10 py-3 text-white'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 sm:h-9">
            {/* Slim Minimal Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.businessName} className="h-6 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={`font-serif tracking-widest text-sm sm:text-base font-bold uppercase ${
                      isScrolled || location.pathname !== '/' ? 'text-showroom-charcoal' : 'text-white'
                    }`}
                  >
                    {settings.businessName?.split(' ')[0] || 'AMBROSIA'}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-showroom-bronze uppercase font-bold border-l border-white/20 pl-2 hidden sm:inline-block">
                    SHOWROOM
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Minimal Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.url;
                const isDarkTop = !isScrolled && location.pathname === '/';
                return (
                  <Link
                    key={idx}
                    to={item.url}
                    className={`text-[11px] font-bold tracking-widest uppercase transition-colors py-0.5 relative ${
                      isActive
                        ? 'text-showroom-bronze font-bold'
                        : isDarkTop
                        ? 'text-white/85 hover:text-white'
                        : 'text-showroom-charcoal/75 hover:text-showroom-charcoal'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-showroom-bronze" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Compact Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-1.5 transition-colors rounded-[5px] ${
                  isScrolled || location.pathname !== '/'
                    ? 'text-showroom-charcoal/80 hover:text-showroom-charcoal hover:bg-showroom-sand/50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Search Catalog"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openEnquiry()}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-[5px] ${
                  isScrolled || location.pathname !== '/'
                    ? 'bg-showroom-charcoal text-[#FAF9F5] hover:bg-showroom-charcoalLight'
                    : 'bg-showroom-bronze hover:bg-showroom-bronzeHover text-white shadow-lg'
                }`}
              >
                <MessageSquare className="w-3 h-3 text-white" />
                <span>Enquire</span>
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-1.5 transition-colors rounded-[5px] ${
                  isScrolled || location.pathname !== '/'
                    ? 'text-showroom-charcoal hover:bg-showroom-sand/50'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-showroom-bg p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
                <span className="font-serif tracking-architectural text-sm font-bold uppercase text-showroom-charcoal">
                  Showroom Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-showroom-muted hover:text-showroom-charcoal rounded-[5px]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 flex flex-col gap-2">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.url}
                    className="text-xs font-bold tracking-architectural uppercase text-showroom-charcoal hover:text-showroom-bronze py-2 flex items-center justify-between border-b border-showroom-sand/40 rounded-[5px] px-1"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-showroom-muted" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-showroom-border space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiry();
                }}
                className="w-full py-2.5 bg-showroom-charcoal text-[#FAF9F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-[5px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-showroom-bronze" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Search Drawer */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-showroom-bg/95 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto w-full px-4 pt-6 pb-4">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-4 h-4 text-showroom-bronze" />
                <input
                  type="text"
                  placeholder="Search by product name, SKU, material (e.g. Statuario, Black Galaxy, Teak)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-base sm:text-lg font-medium outline-none placeholder:text-showroom-muted/60 text-showroom-charcoal rounded-[5px]"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-showroom-muted hover:text-showroom-charcoal rounded-[5px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {isSearching && (
                <div className="text-[11px] uppercase tracking-widest text-showroom-muted py-6 text-center">
                  Searching showroom...
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/product/${p.slug}`);
                      }}
                      className="flex gap-3 p-2.5 bg-white border border-showroom-border hover:border-showroom-charcoal cursor-pointer transition-all group rounded-[5px]"
                    >
                      <div className="w-16 h-16 bg-showroom-ivory shrink-0 overflow-hidden rounded-[5px]">
                        <img
                          src={
                            p.images && p.images.length > 0 && p.images[0]
                              ? p.images[0]
                              : p.categorySlug === 'granite-marble-natural-stone'
                              ? 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=400&q=85'
                              : p.categorySlug === 'wood-works-wooden-doors-plywood'
                              ? 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=400&q=85'
                              : p.categorySlug === 'electrical-products-lighting-switches'
                              ? 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=85'
                              : 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=400&q=85'
                          }
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform rounded-[5px]"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-showroom-bronze truncate">
                          {p.finish} • {p.size}
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-showroom-charcoal truncate">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-showroom-muted truncate">{p.material}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
