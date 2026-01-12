import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the banner if it hasn't been dismissed this session
      const dismissed = sessionStorage.getItem('pwa-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // iOS check: iOS doesn't support beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone;
    if (isIOS && !isStandalone) {
       const dismissed = sessionStorage.getItem('pwa-dismissed');
       if (!dismissed) {
         // Optionally show banner for iOS users to guide them on "Add to Home Screen"
         // For this version, we'll only show the native trigger on Android/Chrome
       }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[2000] px-6 pointer-events-none animate-in slide-in-from-top duration-500">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-5 border border-white/50 bg-[#F0F2F5]/95 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl logo-raised flex items-center justify-center shrink-0">
             <img src="https://img.icons8.com/color/96/xd.png" alt="App Logo" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#1A1C2E] mb-1">Install XpenseFlow</h4>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
              📱 Add to Home Screen for a faster, full-screen experience and offline access!
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
           <button 
             onClick={handleInstall}
             className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
           >
             Install Now
           </button>
           <button 
             onClick={handleDismiss}
             className="px-5 py-2.5 rounded-xl neumorphic-flat text-gray-400 text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all"
           >
             Later
           </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;