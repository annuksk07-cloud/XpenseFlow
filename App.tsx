import React, { useState, useEffect } from 'react';
import { Plus, Lock } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import { CURRENCIES, CurrencyCode } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import Analytics from './components/Analytics';
import BudgetGoals from './components/BudgetGoals';
import FinancialHealth from './components/FinancialHealth';
import SettingsModal from './components/SettingsModal';
import ForecastingWidget from './components/ForecastingWidget';
import SubscriptionManager from './components/SubscriptionManager';
import ToastContainer from './components/Toast';

const AUTO_LOCK_TIMEOUT_MS = 60000; // 60 seconds (Auto-Timeout Logic)

export default function App() {
  const { transactions, addTransaction, deleteTransaction, stats, settings, updateSettings, exportToCSV, backupData, toasts, removeToast } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  // Auto-Lock & Window Blur Logic
  useEffect(() => {
    let timeout: any;
    
    const resetTimer = () => {
      if (isLocked) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsLocked(true);
      }, AUTO_LOCK_TIMEOUT_MS);
    };

    const handleVisibilityChange = () => {
       if (document.hidden && settings.isPrivacyMode) {
           setIsBlurred(true);
       } else {
           setIsBlurred(false);
       }
    };

    const handleBlur = () => {
        if(settings.isPrivacyMode) setIsBlurred(true);
    }
    const handleFocus = () => {
        setIsBlurred(false);
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    
    // Privacy Events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    resetTimer(); // Start timer

    return () => {
      clearTimeout(timeout);
      events.forEach(e => document.removeEventListener(e, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isLocked, settings.isPrivacyMode]);

  const currencySymbol = CURRENCIES[settings.baseCurrency as CurrencyCode]?.symbol || '$';

  // Lock Screen
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#efeeee] flex flex-col items-center justify-center p-6 animate-in fade-in">
         <div className="w-20 h-20 rounded-full bg-[#efeeee] shadow-[10px_10px_20px_#c5c5c5,-10px_-10px_20px_#ffffff] flex items-center justify-center text-blue-500 mb-6">
           <Lock size={40} />
         </div>
         <h2 className="text-2xl font-black text-gray-700 mb-2">App Locked</h2>
         <p className="text-gray-500 mb-8">For your security</p>
         <button 
           onClick={() => setIsLocked(false)}
           className="px-8 py-3 rounded-xl bg-[#efeeee] text-blue-500 font-bold shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#c5c5c5,inset_-6px_-6px_12px_#ffffff] active:scale-[0.98] transition-all"
         >
           Unlock XpenseFlow
         </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#efeeee] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900 ${isBlurred ? 'blur-md' : ''} transition-all duration-300`}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.05)]">
        
        {/* Header */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-700 tracking-tight">
            Xpense<span className="text-blue-500">Flow</span>
          </h1>
          <div className="flex items-center gap-3">
             {settings.isPrivacyMode && <Lock size={16} className="text-gray-400" />}
             <div className="w-10 h-10 rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)] animate-pulse"></div>
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 overflow-y-auto no-scrollbar">
          <Dashboard stats={stats} settings={settings} onOpenSettings={() => setIsSettingsOpen(true)} />
          
          <FinancialHealth 
             savingsRate={stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100 : 0}
             budgetUsage={(stats.totalExpense / settings.budgetLimit) * 100}
             settings={settings}
          />

          <ForecastingWidget stats={stats} settings={settings} />

          <SubscriptionManager transactions={transactions} settings={settings} totalIncome={stats.totalIncome} />

          <BudgetGoals 
            settings={settings} 
            totalExpense={stats.totalExpense} 
            totalSavings={stats.totalIncome - stats.totalExpense}
            onUpdate={updateSettings}
          />

          <Analytics transactions={transactions} />

          <TransactionList transactions={transactions} onDelete={deleteTransaction} currencySymbol={currencySymbol} />
        </main>

        {/* FAB (Floating Action Button) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#efeeee]"
          >
            <Plus size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modals */}
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTransaction}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdate={updateSettings}
          onExportCSV={exportToCSV}
          onBackup={backupData}
        />
        
      </div>
    </div>
  );
}