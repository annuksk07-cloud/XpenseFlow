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

  const bgColor = type === 'success' ? 'border-green-500' : type === 'error' ? 'border-red-500' : 'border-blue-500';
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

  return (
    <div className={`pointer-events-auto flex items-center gap-3 bg-[#efeeee] px-4 py-3 rounded-xl shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] border-l-4 ${bgColor} transition-all duration-300 ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} animate-in slide-in-from-top`}>
      <i className={`fa-solid ${icon}`}></i>
      <span className="text-sm font-bold text-gray-700">{message}</span>
    </div>
  );
};

export default Toast;