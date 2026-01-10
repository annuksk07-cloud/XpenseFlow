import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-1/4 h-full transition-transform active:scale-90 focus:outline-none">
    <div className={`w-14 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'neumorphic-pressed bg-blue-50/50' : ''}`}>
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1A1C2E]'}`}></i>
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#F0F2F5]/90 backdrop-blur-2xl border-t border-white/40 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-20 px-4 max-w-md mx-auto">
        <NavItem icon="fa-home" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <NavItem icon="fa-list-ul" label={t('nav.history')} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <NavItem icon="fa-cog" label={t('nav.settings')} isActive={false} onClick={onSettingsClick} />
      </div>
    </nav>
  );
};

export default BottomNavBar;