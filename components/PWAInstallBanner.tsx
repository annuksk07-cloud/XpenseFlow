import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // 2. Check if user previously dismissed
    const userPreference = localStorage.getItem('xpenseflow-install-dismissed');
    if (userPreference === 'true') return;

    // 3. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIOS ? 'ios' : 'android');

    // 4. Android/Chrome Install Prompt Handler
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delayed appearance for better UX
      setTimeout(() => setIsVisible(true), 2000);
    };

    // 5. iOS Manual Trigger (Safari doesn't support beforeinstallprompt)
    if (isIOS) {
      setTimeout(() => setIsVisible(true), 2000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (platform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (platform === 'ios') {
      // For iOS, the button serves as a "Got it" or just stays visible for instructions
      // We could also show a secondary instruction modal here if needed
      alert("Tap the 'Share' button in your browser's bottom bar, then select 'Add to Home Screen' ➕");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('xpenseflow-install-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 left-0 right-0 z-[3000] px-6 pointer-events-none animate-in slide-in-from-bottom duration-700">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-6 border border-white/40 bg-[#F0F2F5]/95 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl logo-raised flex items-center justify-center shrink-0 border border-white/50">
            <img 
              src="https://img.sanishtech.com/u/4e2e11616c139405209c8eefc1543bd0.png" 
              alt="XpenseFlow" 
              className="w-10 h-10 object-contain" 
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#1A1C2E] leading-tight">Install XpenseFlow</h4>
            <p className="text-[11px] font-medium text-gray-500 mt-1 leading-relaxed">
              {platform === 'ios' 
                ? "Tap the 'Share' icon and then 'Add to Home Screen' ➕" 
                : "Get a faster, native experience and access your expenses offline!"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleInstallClick}
            className="flex-1 py-3.5 rounded-2xl bg-[#3B82F6] text-white text-[11px] font-black uppercase tracking-widest shadow-[0_8px_16px_rgba(59,130,246,0.3)] active:scale-[0.97] active:shadow-inner transition-all"
          >
            {platform === 'ios' ? 'Show Me How' : 'Install Now'}
          </button>
          <button 
            onClick={handleDismiss}
            className="px-6 py-3.5 rounded-2xl neumorphic-flat text-gray-400 text-[11px] font-black uppercase tracking-widest active:neumorphic-pressed transition-all"
          >
            Maybe Later
          </button>
        </div>
        
        {/* iOS Helper Arrow (Visual cue for Safari) */}
        {platform === 'ios' && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[#F0F2F5] drop-shadow-md">
            <i className="fa-solid fa-caret-down text-2xl"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallBanner;