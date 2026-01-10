import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-90 focus:outline-none relative">
    <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'neumorphic-pressed' : ''}`}>
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1A1C2E]'}`}></i>
    </div>
    <span className={`text-[10px] mt-1.5 font-bold transition-colors uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
    {isActive && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 shadow-sm shadow-blue-600/50"></div>}
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#F0F2F5]/70 backdrop-blur-xl border-t border-white/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-24 px-2 max-w-md mx-auto">
        <NavItem icon="fa-house" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon="fa-chart-simple" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <div className="w-20 shrink-0"></div> {/* Spacer for FAB */}
        <NavItem icon="fa-receipt" label={t('nav.history')} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <NavItem icon="fa-sliders" label={t('nav.settings')} isActive={false} onClick={onSettingsClick} />
      </div>
    </nav>
  );
};

export default BottomNavBar;