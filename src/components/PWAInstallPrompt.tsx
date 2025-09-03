import { useState, useEffect } from 'react';
import { X, Download, Smartphone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { triggerInstallPrompt, isAppInstalled } from '@/lib/serviceWorkerRegistration';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    setIsInstalled(isAppInstalled());

    // Listen for install availability
    const handleInstallable = () => {
      if (!isAppInstalled()) {
        // Show prompt after a delay
        setTimeout(() => setShowPrompt(true), 30000); // Show after 30 seconds
      }
    };

    window.addEventListener('app-installable', handleInstallable);

    // Listen for app installed
    const handleInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('app-installable', handleInstallable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    const accepted = await triggerInstallPrompt();
    
    if (accepted) {
      setShowPrompt(false);
    }
    
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if we should suppress the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className="medical-gradient p-1">
          <div className="bg-background rounded p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Install MyYearGroup</h3>
                  <p className="text-sm text-muted-foreground">Get quick access from your home screen</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-accent/50 rounded-lg p-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Work offline with cached content</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Get instant notifications</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Launch from your home screen</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="medical"
                  size="sm"
                  className="flex-1"
                  onClick={handleInstall}
                  disabled={isInstalling}
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install App
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                >
                  Not Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}