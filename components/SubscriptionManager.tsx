import React from 'react';
import { Transaction, TransactionType, UserSettings } from '../types';
import { RefreshCw, CalendarClock, AlertCircle } from 'lucide-react';

interface SubscriptionManagerProps {
  transactions: Transaction[];
  settings: UserSettings;
  totalIncome: number;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ transactions, settings, totalIncome }) => {
  // Filter for recurring expenses
  const subscriptions = transactions.filter(t => t.isRecurring && t.type === TransactionType.EXPENSE);

  if (subscriptions.length === 0) return null;

  const totalMonthlySubs = subscriptions.reduce((acc, t) => acc + t.amount, 0);
  const fatigueRatio = totalIncome > 0 ? (totalMonthlySubs / totalIncome) * 100 : 0;
  const isFatigueWarning = fatigueRatio > 20;

  const getDaysUntilDue = (dateStr: string) => {
    const today = new Date();
    const transDate = new Date(dateStr);
    
    // Assume due date is the same day of the month
    let nextDue = new Date(today.getFullYear(), today.getMonth(), transDate.getDate());
    
    if (nextDue < today) {
        nextDue = new Date(today.getFullYear(), today.getMonth() + 1, transDate.getDate());
    }

    const diffTime = Math.abs(nextDue.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.baseCurrency,
    maximumFractionDigits: 0
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-lg font-bold text-gray-700">Recurring Bills</h3>
        {isFatigueWarning && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-600 text-[10px] font-bold">
                <AlertCircle size={10} />
                <span>Fatigue High ({fatigueRatio.toFixed(0)}%)</span>
            </div>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {subscriptions.map(sub => {
            const daysLeft = getDaysUntilDue(sub.date);
            const isSoon = daysLeft <= 5;

            return (
                <div key={sub.id} className="min-w-[160px] p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-500 shadow-sm">
                            <RefreshCw size={14} />
                        </div>
                        <span className={`font-bold text-sm ${settings.isPrivacyMode ? 'blur-xs' : 'text-gray-700'}`}>
                            {currencyFormatter.format(sub.amount)}
                        </span>
                    </div>
                    
                    <div>
                        <p className="font-bold text-gray-600 text-sm truncate">{sub.title}</p>
                        <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${isSoon ? 'text-orange-500' : 'text-green-600'}`}>
                            <CalendarClock size={12} />
                            <span>{daysLeft} days left</span>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default SubscriptionManager;