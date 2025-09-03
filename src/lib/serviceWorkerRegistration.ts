// Service Worker Registration for PWA

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      if (isLocalhost()) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl);
      }
    });
  }
}

function isLocalhost(): boolean {
  return Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
}

function registerValidSW(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; please refresh
              console.log('New content is available; please refresh.');
              
              // Optionally show a notification to the user
              if (window.confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            } else {
              // Content is cached for offline use
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string) {
  // Check if the service worker can be found
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window && navigator.serviceWorker) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  }
  return false;
}

// Send notification through service worker
export async function sendNotification(title: string, options?: NotificationOptions) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        ...options
      });
    }
  }
}

// Check if app is installed
export function isAppInstalled(): boolean {
  // Check for iOS
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  // Check for Android/Desktop
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  return false;
}

// Defer install prompt
let deferredPrompt: any;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('Install prompt ready');
    
    // Optionally, notify the app that install is available
    window.dispatchEvent(new CustomEvent('app-installable'));
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
}

// Trigger install prompt
export async function triggerInstallPrompt() {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }
  
  // Show the prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to the install prompt: ${outcome}`);
  
  // Clear the deferred prompt
  deferredPrompt = null;
  
  return outcome === 'accepted';
}