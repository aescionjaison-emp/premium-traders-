import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Layers,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  LayoutTemplate,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IProduct, IEnquiry } from '../../types/index.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCollections: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    featuredProducts: 0,
  });

  const [recentProducts, setRecentProducts] = useState<IProduct[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<IEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
        const [prodsRes, catsRes, colsRes, enqRes] = await Promise.all([
          api.getProducts({ limit: 8, admin: 'true' }).catch(() => ({ data: { success: false, data: MASTER_SHOWROOM_PRODUCTS, pagination: { total: MASTER_SHOWROOM_PRODUCTS.length } } })),
          api.getCategories().catch(() => ({ data: { success: false, data: [] } })),
          api.getCollections().catch(() => ({ data: { success: false, data: [] } })),
          api.getEnquiries({ limit: 6 }).catch(() => ({ data: { success: false, data: [] } })),
        ]);

        const prodsList = (prodsRes.data?.data && prodsRes.data.data.length > 0) ? prodsRes.data.data : MASTER_SHOWROOM_PRODUCTS;
        const totalProds = (prodsRes.data as any)?.pagination?.total || prodsList.length;
        const featuredCount = prodsList.filter((p) => p.featured).length;
        const totalCats = catsRes.data?.data?.length || 4;
        const totalCols = colsRes.data?.data?.length || 4;
        const enqList = enqRes.data?.data || [];
        const totalEnq = (enqRes.data as any)?.pagination?.total || enqList.length;
        const newEnqCount = enqList.filter((e) => e.status === 'NEW').length;

        setStats({
          totalProducts: totalProds,
          totalCategories: totalCats,
          totalCollections: totalCols,
          totalEnquiries: totalEnq,
          newEnquiries: newEnqCount,
          featuredProducts: featuredCount,
        });

        setRecentProducts(prodsList.slice(0, 5));
        setRecentEnquiries(enqList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, link: '/admin/products' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderTree, link: '/admin/categories' },
    { label: 'Collections', value: stats.totalCollections, icon: Layers, link: '/admin/collections' },
    { label: 'Specification Leads', value: stats.totalEnquiries, icon: MessageSquare, link: '/admin/enquiries', highlight: stats.newEnquiries > 0 ? `${stats.newEnquiries} New` : null },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            CONTROL CENTER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-showroom-charcoal">
            SHOWROOM OVERVIEW
          </h1>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products/new"
            className="px-3.5 py-2 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-showroom-bronze" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/homepage"
            className="px-3.5 py-2 bg-white hover:bg-showroom-sand border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-showroom-bronze" />
            <span>Edit Homepage</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="px-3.5 py-2 bg-white hover:bg-showroom-sand border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-showroom-bronze" />
            <span>View Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-5 border border-showroom-border hover:border-showroom-charcoal hover:shadow-card transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-muted block mb-1">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-serif font-bold text-showroom-charcoal">
                    {card.value}
                  </span>
                  {card.highlight && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-showroom-bronze text-white">
                      {card.highlight}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-showroom-sand/40 text-showroom-charcoal group-hover:bg-showroom-charcoal group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dual Section: Recent Products & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-showroom-border p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-showroom-border">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal flex items-center gap-2">
              <Package className="w-4 h-4 text-showroom-bronze" />
              <span>Recently Catalogued Products</span>
            </h2>
            <Link
              to="/admin/products"
              className="text-[11px] uppercase font-bold text-showroom-bronze hover:underline"
            >
              Manage ({stats.totalProducts}) →
            </Link>
          </div>

          <div className="divide-y divide-showroom-sand/60">
            {recentProducts.map((p) => (
              <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-showroom-ivory shrink-0 overflow-hidden border border-showroom-border">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=200&q=85'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs font-bold uppercase text-showroom-charcoal truncate">
                      {p.name}
                    </h3>
                    <span className="text-[10px] text-showroom-muted font-mono">
                      {p.sku} • {p.finish} • {p.size}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/admin/products/${p._id}/edit`}
                  className="shrink-0 px-2.5 py-1 bg-showroom-sand/50 hover:bg-showroom-charcoal hover:text-white text-showroom-charcoal text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-showroom-border p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-showroom-border">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-showroom-bronze" />
              <span>Incoming Specification Leads</span>
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-[11px] uppercase font-bold text-showroom-bronze hover:underline"
            >
              All Leads ({stats.totalEnquiries}) →
            </Link>
          </div>

          <div className="divide-y divide-showroom-sand/60">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq) => (
                <div key={enq._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-showroom-charcoal truncate">
                        {enq.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 ${
                          enq.status === 'NEW'
                            ? 'bg-showroom-bronze text-white'
                            : enq.status === 'CONTACTED'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-green-100 text-green-900'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-showroom-muted truncate mt-0.5">
                      {enq.phone} • {enq.productName || 'General Inquiry'}
                    </p>
                  </div>

                  <Link
                    to="/admin/enquiries"
                    className="shrink-0 text-xs font-bold text-showroom-bronze hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-showroom-muted">
                No customer inquiries logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
