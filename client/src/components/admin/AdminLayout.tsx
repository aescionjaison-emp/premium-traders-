import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu, ExternalLink, CloudUpload, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { AdminSidebar } from './AdminSidebar.js';
import { api } from '../../api/endpoints.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { success, error } = useToast();

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncAllToCloud();
      if (res.data.success) {
        success('All CMS data synced to Cloud Firestore! Visible on all domains.');
      } else {
        error('Could not sync to cloud.');
      }
    } catch {
      error('Failed to sync to cloud.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-showroom-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-showroom-border border-t-showroom-bronze rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-showroom-charcoal flex flex-col">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-showroom-border px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-showroom-charcoal hover:bg-showroom-sand/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif text-sm font-bold uppercase tracking-architectural text-showroom-charcoal">
              Ambrosia CMS Management
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              title="Push all local changes to Cloud Database (syncs .web.app & .firebaseapp.com)"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-showroom-charcoal text-white text-[11px] font-bold uppercase tracking-wider hover:bg-showroom-charcoalLight transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-showroom-bronze" />
              <span>Live Website</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
