import React, { useState, useEffect } from 'react';
import { useTransactions } from './hooks/useTransactions';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import SettingsModal from './components/SettingsModal';
import Analytics from './components/Analytics';
import FinancialHealth from './components/FinancialHealth';
import AIInsights from './components/AIInsights';
import SubscriptionManager from './components/SubscriptionManager';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, subscriptions, addSubscription, deleteSubscription, stats, settings, updateSettings, toasts, removeToast, exportToCSV, backupData, isDataLoaded } = useTransactions();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddSubModalOpen, setAddSubModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#efeeee]">
        <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto min-h-screen bg-[#efeeee] text-gray-700 font-sans flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.05)] relative">
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight">Xpense<span className="text-blue-500">Flow</span></h1>
          <div className="w-10 h-10 rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff]"></div>
        </header>

        <main className="flex-1 px-6 overflow-y-auto pb-24">
          <Dashboard stats={stats} settings={settings} onSettingsClick={() => setSettingsModalOpen(true)} />
          <FinancialHealth stats={stats} settings={settings} updateSettings={updateSettings} />
          <AIInsights transactions={transactions} />
          <SubscriptionManager subscriptions={subscriptions} settings={settings} onDelete={deleteSubscription} onAddClick={() => setAddSubModalOpen(true)} />
          <Analytics transactions={transactions} />
          <TransactionList transactions={transactions} onDelete={deleteTransaction} settings={settings} />
        </main>
        
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] active:scale-95 transition-transform"
            aria-label="Add new transaction"
          >
            <i className="fa-solid fa-plus fa-2x"></i>
          </button>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addTransaction}
      />
      
      <AddSubscriptionModal
        isOpen={isAddSubModalOpen}
        onClose={() => setAddSubModalOpen(false)}
        onAdd={addSubscription}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        onExport={exportToCSV}
        onBackup={backupData}
      />

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </>
  );
};

export default App;