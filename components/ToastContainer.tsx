
import React, { useState, useEffect } from 'react';
import { toast, ToastMessage } from '../services/toastService';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      if (newToast.duration) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    });
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="pointer-events-auto min-w-[320px] max-w-sm bg-dark-surface/90 backdrop-blur-md border border-dark-border rounded-lg shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300"
        >
          <div className="shrink-0 mt-0.5">{getIcon(t.type)}</div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">{t.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{t.message}</p>
          </div>
          <button 
            onClick={() => removeToast(t.id)}
            className="text-zinc-500 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
