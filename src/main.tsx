import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './lib/serviceWorkerRegistration'

// Register service worker for PWA functionality
serviceWorkerRegistration.register();

// Setup install prompt handler
serviceWorkerRegistration.setupInstallPrompt();

createRoot(document.getElementById("root")!).render(<App />);
