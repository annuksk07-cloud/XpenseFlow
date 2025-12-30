import React from 'react';
import { Subscription, Settings } from '../types';

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  settings: Settings;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const getSubscriptionIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('netflix')) return 'fa-film';
  if (lowerName.includes('spotify') || lowerName.includes('music')) return 'fa-music';
  if (lowerName.includes('gym')) return 'fa-dumbbell';
  if (lowerName.includes('cloud') || lowerName.includes('drive')) return 'fa-cloud';
  if (lowerName.includes('vpn')) return 'fa-shield-halved';
  return 'fa-sync-alt';
};

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ subscriptions, settings, onDelete, onAddClick }) => {
  const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const calculateDaysRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center px-2 mb-3">
        <h3 className="text-lg font-bold text-gray-700">Subscription Manager</h3>
        <button onClick={onAddClick} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#efeeee] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] text-blue-500">
            <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>No active subscriptions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map(sub => {
              const daysLeft = calculateDaysRemaining(sub.nextDueDate);
              return (
                <div key={sub.id} className="group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#efeeee] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] text-blue-500">
                      <i className={`fa-solid ${getSubscriptionIcon(sub.name)}`}></i>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{sub.name}</p>
                      <span className="text-xs text-gray-500">{formatCurrency(sub.amount, sub.currency)} / {sub.billingCycle.slice(0, 2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                        <p className={`font-bold text-sm ${daysLeft < 7 ? 'text-orange-500' : 'text-gray-600'}`}>{daysLeft}</p>
                        <p className="text-[10px] text-gray-400">days</p>
                    </div>
                    <button onClick={() => onDelete(sub.id)} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                      <i className="fa-solid fa-trash-alt fa-sm"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManager;
