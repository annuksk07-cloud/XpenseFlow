import React from 'react';
import { Subscription, Settings } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const calculateDaysRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center px-2 mb-3">
        <h3 className="text-lg font-bold text-[#1A1C2E]">{t('dashboard.subscriptions')}</h3>
        <button onClick={onAddClick} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-[#00D09C] hover:bg-gray-200 transition-colors">
            <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>{t('dashboard.noSubscriptions')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map(sub => {
              const daysLeft = calculateDaysRemaining(sub.nextDueDate);
              return (
                <div key={sub.id} className="group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 text-blue-600">
                      <i className={`fa-solid ${getSubscriptionIcon(sub.name)}`}></i>
                    </div>
                    <div>
                      <p className="font-bold text-[#2D3748] text-sm">{sub.name}</p>
                      <span className="text-xs text-gray-500">{formatCurrency(sub.amount, sub.currency)} / {sub.billingCycle.slice(0, 2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                        <p className={`font-bold text-sm ${daysLeft < 7 ? 'text-orange-500' : 'text-gray-700'}`}>{daysLeft}</p>
                        <p className="text-xs text-gray-400">days</p>
                    </div>
                    <button onClick={() => onDelete(sub.id)} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity">
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