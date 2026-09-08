import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IEnquiry } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<IEnquiry | null>(null);

  const { success, error } = useToast();

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.getEnquiries(params);
      if (res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatusChange = async (enquiryId: string, newStatus: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    try {
      const res = await api.updateEnquiryStatus(enquiryId, newStatus);
      if (res.data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? { ...e, status: newStatus } : e))
        );
        success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleWhatsAppReply = (enq: IEnquiry) => {
    const clean = enq.phone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hello ${enq.name}, thank you for inquiring with Ambrosia Architectural Showroom regarding "${enq.productName || 'our catalog'}". How may our material consultant assist your project?`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteEnquiry(deleteTarget._id);
      success('Enquiry lead deleted');
      setDeleteTarget(null);
      fetchEnquiries();
    } catch (err) {
      error('Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            CLIENT SPECIFICATIONS & LEADS
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            ENQUIRIES ({enquiries.length})
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 border border-showroom-border self-start sm:self-auto">
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                statusFilter === status
                  ? 'bg-showroom-charcoal text-white'
                  : 'text-showroom-muted hover:text-showroom-charcoal'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs uppercase text-showroom-muted">
            Loading enquiries...
          </div>
        ) : enquiries.length > 0 ? (
          enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white border border-showroom-border p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-showroom-charcoal transition-colors"
            >
              {/* Left: Client & Product Info */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-base font-bold uppercase text-showroom-charcoal">
                    {enq.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 ${
                      enq.status === 'NEW'
                        ? 'bg-showroom-bronze text-white'
                        : enq.status === 'CONTACTED'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-green-100 text-green-900'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-[10px] font-mono text-showroom-muted">
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-showroom-charcoalLight">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-showroom-bronze" />
                    <strong>{enq.phone}</strong>
                  </span>
                  {enq.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-showroom-bronze" />
                      <span>{enq.email}</span>
                    </span>
                  )}
                </div>

                {enq.productName && (
                  <div className="text-xs text-showroom-charcoal bg-showroom-sand/30 p-2 border border-showroom-border/60">
                    <span className="font-bold text-showroom-bronze uppercase text-[10px] block">
                      Target Material
                    </span>
                    <span className="font-bold">{enq.productName}</span>
                    {enq.productSku && <span className="font-mono text-showroom-muted"> (SKU: {enq.productSku})</span>}
                  </div>
                )}

                {enq.message && (
                  <p className="text-xs text-showroom-muted italic">
                    "{enq.message}"
                  </p>
                )}
              </div>

              {/* Right: Actions & Status selector */}
              <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-showroom-sand/60">
                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value as any)}
                    className="bg-showroom-bg border border-showroom-border px-2.5 py-1.5 text-xs text-showroom-charcoal font-bold uppercase focus:outline-none"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="CONTACTED">Status: CONTACTED</option>
                    <option value="CLOSED">Status: CLOSED</option>
                  </select>

                  <button
                    onClick={() => handleWhatsAppReply(enq)}
                    className="px-3 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#128C7E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#25D366]/30"
                    title="Send WhatsApp Message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(enq)}
                    className="p-1.5 text-red-600 hover:text-red-800"
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-white border border-showroom-border text-showroom-muted text-xs uppercase">
            No specification enquiries found under "{statusFilter}".
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Enquiry"
        message={`Delete lead from "${deleteTarget?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
