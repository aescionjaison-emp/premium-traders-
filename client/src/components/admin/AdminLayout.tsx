import React, { useState, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu, ExternalLink, CloudUpload, Download, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { AdminSidebar } from './AdminSidebar.js';
import { api } from '../../api/endpoints.js';
import { localStore } from '../../api/localStore.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncAllToCloud();
      if (res.data.success) {
        success('All CMS data synced to Cloud Firestore! Visible on all domains.');
      } else {
        error('Firestore rules blocked. Use "Export Data" below to transfer instantly!');
      }
    } catch {
      error('Firestore sync error. Use "Export Data" to transfer instantly.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportData = () => {
    try {
      const jsonString = localStore.exportAllData();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ambrosia_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('CMS Data exported! You can now import this file on any domain.');
    } catch {
      error('Failed to export CMS data.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const ok = localStore.importAllData(content);
        if (ok) {
          success('CMS Data imported and merged successfully! Reloading...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          error('Invalid CMS backup file format.');
        }
      } catch {
        error('Failed to parse CMS backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        <header className="sticky top-0 z-30 bg-white border-b border-showroom-border px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-subtle flex-wrap gap-2">
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

          <div className="flex items-center gap-2 sm:gap-2 flex-wrap">
            {/* Hidden file input for import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            {/* Export Snapshot Button */}
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F5] border border-showroom-border hover:bg-showroom-sand/40 text-showroom-charcoal text-[11px] font-bold uppercase tracking-wider transition-colors"
              title="Download full CMS dataset snapshot JSON"
            >
              <Download className="w-3.5 h-3.5 text-showroom-bronze" />
              <span>Export</span>
            </button>

            {/* Import Snapshot Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F5] border border-showroom-border hover:bg-showroom-sand/40 text-showroom-charcoal text-[11px] font-bold uppercase tracking-wider transition-colors"
              title="Upload & merge CMS dataset snapshot JSON"
            >
              <Upload className="w-3.5 h-3.5 text-showroom-bronze" />
              <span>Import</span>
            </button>

            {/* Sync Cloud Button */}
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
