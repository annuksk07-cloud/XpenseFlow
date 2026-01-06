import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-1/4 h-full transition-transform active:scale-90 focus:outline-none">
    <div className={`w-16 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive ? 'neumorphic-pressed bg-blue-50' : ''}`}>
        <i className={`fa-solid ${icon} text-xl transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1A1C2E]'}`}></i>
    </div>
    <span className={`text-xs mt-1 font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-4 inset-x-4 h-20 bg-[#F0F2F5] rounded-3xl z-50" style={{boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff'}}>
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