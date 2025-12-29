import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastMessage, ToastType } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={18} className="text-green-500" />;
      case 'error': return <AlertCircle size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="pointer-events-auto flex items-center gap-3 bg-[#efeeee] px-4 py-3 rounded-xl shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] border-l-4 border-l-current animate-in slide-in-from-top-2 fade-in duration-300" style={{ color: toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : '#3b82f6' }}>
      {getIcon()}
      <span className="text-sm font-bold text-gray-700">{toast.message}</span>
    </div>
  );
};

export default ToastContainer;