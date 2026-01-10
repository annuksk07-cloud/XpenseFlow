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
  
  // Resolve infinite loader if user is logged in but data failed
  if (loading || (!isDataLoaded && user)) {
    return <SkeletonLoader />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="page-transition space-y-8">
            <Dashboard stats={stats} settings={settings} />
            <FinancialHealth stats={stats} settings={settings} />
            <SubscriptionManager subscriptions={subscriptions} settings={settings} onDelete={deleteSubscription} onAddClick={() => setAddSubModalOpen(true)} />
          </div>
        );
      case 'analytics':
        return <div className="page-transition"><Analytics transactions={transactions} /></div>;
      case 'transactions':
        return <div className="page-transition"><TransactionList transactions={transactions} onDelete={deleteTransaction} settings={settings} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-[#F0F2F5] text-[#1A1C2E] flex flex-col relative overflow-hidden">
      <header className="px-6 pt-12 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight text-[#1A1C2E]">Xpense<span className="text-blue-600">Flow</span></h1>
          <button className="w-11 h-11 rounded-full neumorphic-flat flex items-center justify-center active:scale-90 transition-all overflow-hidden border-2 border-white ring-4 ring-black/5">
            <img src={user.photoURL || `https://i.pravatar.cc/48?u=${user.uid}`} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Main scroll area with huge padding bottom for floating UI components */}
      <main className="flex-1 px-6 overflow-y-auto pb-40 scroll-smooth">
        {renderContent()}
      </main>
      
      {/* Centered Floating Action Button above the Nav bar */}
      <div className="fixed bottom-[92px] left-1/2 -translate-x-1/2 z-[1100] pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => setAddModalOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center neumorphic shadow-blue-600/30 active:scale-95 transition-all shadow-xl"
          aria-label={t('fab.addTransaction')}
        >
          <i className="fa-solid fa-plus fa-xl"></i>
        </button>
      </div>
      
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} onSettingsClick={() => setSettingsModalOpen(true)} />

      {/* Modals are higher z-index than Nav */}
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={addTransaction} />
      <AddSubscriptionModal isOpen={isAddSubModalOpen} onClose={() => setAddSubModalOpen(false)} onAdd={addSubscription} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} settings={settings} updateSettings={updateSettings} onExportCSV={exportToCSV} onExportPDF={exportToPDF} />

      {/* Toast notifications at the very top */}
      <div className="fixed top-14 left-0 right-0 z-[2000] flex flex-col items-center gap-2 pointer-events-none px-6">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => <AppContent />;
export default App;