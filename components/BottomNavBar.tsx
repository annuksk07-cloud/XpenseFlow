import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
  onAddClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 focus:outline-none relative z-10">
    <div className={`w-11 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'neumorphic-pressed bg-white/40' : ''}`}>
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1A1C2E] opacity-70'}`}></i>
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick, onAddClick }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] px-0 pb-0 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* Fintech Oversized FAB - Anchored deeper into the dock */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[1100]">
          <button
            onClick={onAddClick}
            className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_12px_24px_rgba(37,99,235,0.4),0_0_15px_rgba(37,99,235,0.2)] border-4 border-white active:scale-90 transition-all group"
            aria-label={t('fab.addTransaction')}
          >
            <i className="fa-solid fa-plus text-2xl group-active:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        {/* Custom Notched SVG Dock Background */}
        <div className="relative w-full h-[100px] flex items-end">
          <svg 
            width="100%" 
            height="85" 
            viewBox="0 0 375 85" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 left-0 filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.03)]"
          >
            <path 
              d="M0 20C0 8.95431 8.95431 0 20 0H140C150 0 155 0 160 5C165 10 170 35 187.5 35C205 35 210 10 215 5C220 0 225 0 235 0H355C366.046 0 375 8.95431 375 20V85H0V20Z" 
              fill="#F0F2F5" 
              fillOpacity="0.95"
            />
          </svg>
          
          {/* Glass Overlay for the SVG Path to simulate backdrop blur */}
          <div className="absolute bottom-0 left-0 w-full h-[85px] bg-[#F0F2F5]/20 backdrop-blur-2xl rounded-t-[32px] pointer-events-none" style={{ clipPath: 'path("M0 20C0 8.95431 8.95431 0 20 0H140C150 0 155 0 160 5C165 10 170 35 187.5 35C205 35 210 10 215 5C220 0 225 0 235 0H355C366.046 0 375 8.95431 375 20V85H0V20Z")' }}></div>

          {/* Navigation Items Grid */}
          <nav className="grid grid-cols-5 w-full h-[85px] px-2 relative z-10 pb-[env(safe-area-inset-bottom)]">
            <NavItem icon="fa-house" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            
            {/* Center Spacer for Notched FAB */}
            <div className="w-full"></div>
            
            <NavItem icon="fa-list-ul" label={t('nav.history')} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
            <NavItem icon="fa-cog" label={t('nav.settings')} isActive={false} onClick={onSettingsClick} />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;