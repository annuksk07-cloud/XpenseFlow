import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'info' | 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 2700);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styleMap = {
    info: { border: 'border-blue-500', icon: 'fa-info-circle', iconColor: 'text-blue-500' },
    success: { border: 'border-[#00D09C]', icon: 'fa-check-circle', iconColor: 'text-[#00D09C]' },
    error: { border: 'border-red-500', icon: 'fa-times-circle', iconColor: 'text-red-500' },
  };

  const { border, icon, iconColor } = styleMap[type];

  return (
    <div className={`pointer-events-auto flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border-l-4 ${border} transition-all duration-300 ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} animate-in slide-in-from-top`}>
      <i className={`fa-solid ${icon} ${iconColor}`}></i>
      <span className="text-sm font-bold text-[#2D3748]">{message}</span>
    </div>
  );
};

export default Toast;