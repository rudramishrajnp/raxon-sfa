import React from 'react';
import { AlertTriangle, AlertCircle, Info, HelpCircle, Check, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  itemName?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  subMessage,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  itemName,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colorStyles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100 text-red-600',
      btn: 'bg-red-600 hover:bg-red-700 text-white',
      badge: 'bg-red-100 text-red-800'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'bg-amber-100 text-amber-800'
    },
    info: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-600',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      badge: 'bg-indigo-100 text-indigo-800'
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'bg-emerald-100 text-emerald-800'
    }
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-150 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto">
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-2xl ${colorStyles.iconBg} shrink-0`}>
              {type === 'danger' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : type === 'warning' ? (
                <AlertCircle className="w-6 h-6" />
              ) : (
                <Info className="w-6 h-6" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {title}
              </h3>
              
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                {message}
              </div>

              {itemName && (
                <div className={`mt-3 p-2.5 rounded-xl border ${colorStyles.bg} ${colorStyles.border} text-xs font-semibold text-gray-800 break-all flex items-center space-x-2`}>
                  <span className="w-2 h-2 rounded-full bg-current shrink-0"></span>
                  <span>{itemName}</span>
                </div>
              )}

              {subMessage && (
                <p className="mt-2 text-xs text-gray-500 font-medium">
                  {subMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50/80 px-5 py-3.5 sm:px-6 sm:py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors shadow-2xs text-center"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors text-center ${colorStyles.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
