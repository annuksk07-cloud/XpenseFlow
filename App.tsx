import React, { useState } from 'react';
import { useTransactions } from './i18n/hooks/useTransactions';
import { useAuth } from './AuthContext';
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
import PWAInstallBanner from './components/PWAInstallBanner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { transactions, addTransaction, deleteTransaction, subscriptions, addSubscription, deleteSubscription, stats, settings, updateSettings, toasts, removeToast, exportToCSV, exportToPDF, isDataLoaded } = useTransactions();
  
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddSubModalOpen, setAddSubModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
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
    <>
      <header className="px-6 pt-14 pb-4 shrink-0 bg-[#F0F2F5]/80 backdrop-blur-md z-30 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight text-[#1A1C2E]">
            Xpense<span className="text-[#2563EB]">Flow</span>
          </h1>
          <div className="w-11 h-11 rounded-full logo-raised flex items-center justify-center border-2 border-white overflow-hidden active:scale-95 transition-all">
            <img 
              src="https://ik.imagekit.io/13pcmqqzn/1000169239-removebg-preview%20(1).png?updatedAt=1768349953144" 
              alt="XpenseFlow Branded Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      <main className="scroll-container px-6 pt-4 pb-40 z-0 relative">
        {renderContent()}
      </main>
      
      <PWAInstallBanner />

      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSettingsClick={() => setSettingsModalOpen(true)}
        onAddClick={() => setAddModalOpen(true)}
      />

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={addTransaction} />
      <AddSubscriptionModal isOpen={isAddSubModalOpen} onClose={() => setAddSubModalOpen(false)} onAdd={addSubscription} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} settings={settings} updateSettings={updateSettings} onExportCSV={exportToCSV} onExportPDF={exportToPDF} />

      <div className="fixed top-14 left-0 right-0 z-[2000] flex flex-col items-center gap-2 pointer-events-none px-6">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </>
  );
};

const App: React.FC = () => <AppContent />;
export default App;