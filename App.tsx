import React, { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import SettingsModal from './components/SettingsModal';
import Analytics from './components/Analytics';
import SubscriptionManager from './components/SubscriptionManager';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import FinancialHealth from './components/FinancialHealth';
import Toast from './components/Toast';
import BottomNavBar from './components/BottomNavBar';
import SkeletonLoader from './components/SkeletonLoader';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { transactions, addTransaction, deleteTransaction, subscriptions, addSubscription, deleteSubscription, stats, settings, updateSettings, toasts, removeToast, exportToCSV, exportToPDF, isDataLoaded } = useTransactions();
  
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddSubModalOpen, setAddSubModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  if (loading || !isDataLoaded) {
    return <SkeletonLoader />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Dashboard stats={stats} settings={settings} />
            <FinancialHealth stats={stats} settings={settings} />
            <SubscriptionManager subscriptions={subscriptions} settings={settings} onDelete={deleteSubscription} onAddClick={() => setAddSubModalOpen(true)} />
          </>
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'transactions':
        return <TransactionList transactions={transactions} onDelete={deleteTransaction} settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto min-h-screen bg-[#F0F2F5] text-[#1A1C2E] font-sans flex flex-col relative">
        <header className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1C2E]">Xpense<span className="text-blue-600">Flow</span></h1>
            <button className="w-12 h-12 rounded-full neumorphic-flat flex items-center justify-center active:neumorphic-pressed transition-all">
              <img src={user.photoURL || `https://i.pravatar.cc/48?u=${user.uid}`} alt="Profile" className="rounded-full w-10 h-10" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 overflow-y-auto pb-36">
          {renderContent()}
        </main>
        
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center neumorphic-flat active:neumorphic-pressed !shadow-blue-600/30 transition-all"
            aria-label={t('fab.addTransaction')}
          >
            <i className="fa-solid fa-plus fa-2x"></i>
          </button>
        </div>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} onSettingsClick={() => setSettingsModalOpen(true)} />
      </div>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={addTransaction} />
      <AddSubscriptionModal isOpen={isAddSubModalOpen} onClose={() => setAddSubModalOpen(false)} onAdd={addSubscription} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} settings={settings} updateSettings={updateSettings} onExportCSV={exportToCSV} onExportPDF={exportToPDF} />

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </>
  );
};

const App: React.FC = () => (
  <AppContent />
);

export default App;