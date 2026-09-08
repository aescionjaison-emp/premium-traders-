import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-showroom-border p-6 shadow-2xl space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-showroom-muted hover:text-showroom-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          {isDestructive && (
            <div className="p-2 bg-red-100 text-red-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
              {title}
            </h3>
            <p className="text-xs text-showroom-muted mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-showroom-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-showroom-border text-xs font-bold uppercase tracking-wider text-showroom-charcoal hover:bg-showroom-sand/50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors ${
              isDestructive
                ? 'bg-red-700 hover:bg-red-800'
                : 'bg-showroom-charcoal hover:bg-showroom-charcoalLight'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
