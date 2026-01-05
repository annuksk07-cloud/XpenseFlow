import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-1/4 h-16 transition-transform active:scale-90">
    <i className={`fa-solid ${icon} text-xl transition-colors ${isActive ? 'text-blue-600' : 'text-[#1A1C2E]'}`}></i>
    <span className={`text-xs mt-1 font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-[90%] max-w-sm h-20 bg-white/30 backdrop-blur-xl rounded-full shadow-lg border border-white/20 z-50">
      <div className="flex justify-around items-center h-full">
        <NavItem icon="fa-home" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <NavItem icon="fa-list-ul" label={t('nav.history')} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <NavItem icon="fa-cog" label={t('nav.settings')} isActive={false} onClick={onSettingsClick} />
      </div>
    </div>
  );
};

export default BottomNavBar;