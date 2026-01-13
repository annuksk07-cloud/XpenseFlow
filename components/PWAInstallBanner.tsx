import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // 1. Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // 2. Check persistence (hide for 24 hours if dismissed)
    const hideUntil = localStorage.getItem('xpenseflow_pwa_hide_until');
    if (hideUntil && parseInt(hideUntil) > Date.now()) return;

    // 3. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIOS ? 'ios' : 'android');

    // 4. Handle Android/Chrome Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds before showing the prompt
      setTimeout(() => setIsVisible(true), 3000);
    };

    // 5. iOS Logic: Show instructions after 3 seconds (since they don't have automated prompt)
    if (isIOS) {
      setTimeout(() => setIsVisible(true), 3000);
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
      // For iOS, the button serves to acknowledge the instruction
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    // Hide for 24 hours
    const hideUntil = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('xpenseflow_pwa_hide_until', hideUntil.toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 left-0 right-0 z-[5000] px-6 pointer-events-none animate-in slide-in-from-bottom duration-1000">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-6 border border-white/60 bg-[#F0F2F5]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl logo-raised flex items-center justify-center shrink-0 border border-white/50">
            <img 
              src="https://img.sanishtech.com/u/4e2e11616c139405209c8eefc1543bd0.png" 
              alt="XpenseFlow" 
              className="w-10 h-10 object-contain" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-[#1A1C2E] leading-tight">Install XpenseFlow</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-1.5 leading-relaxed">
              {platform === 'ios' 
                ? "To Install: Tap 'Share' then 'Add to Home Screen' ➕" 
                : "Add to home screen for instant access and a better, native-like experience."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleInstallClick}
            className="flex-1 py-3.5 rounded-2xl bg-[#3B82F6] text-white text-[11px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(59,130,246,0.3)] active:scale-[0.96] transition-all"
          >
            {platform === 'ios' ? 'Got it!' : 'Install Now'}
          </button>
          <button 
            onClick={handleMaybeLater}
            className="px-6 py-3.5 rounded-2xl neumorphic-flat text-gray-400 text-[11px] font-black uppercase tracking-widest active:neumorphic-pressed transition-all"
          >
            Later
          </button>
        </div>
        
        {/* Visual Cue for iOS Safari Tool Bar */}
        {platform === 'ios' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[#F0F2F5] drop-shadow-lg">
            <i className="fa-solid fa-caret-down text-3xl"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallBanner;