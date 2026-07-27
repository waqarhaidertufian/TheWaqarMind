import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGA } from './lib/analytics';
import { initClarity } from './lib/clarity';
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Google Analytics
const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
if (trackingId) {
  initGA(trackingId);
}

// Initialize Microsoft Clarity
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
if (clarityProjectId) {
  initClarity(clarityProjectId);
}

// Initialize Vercel Speed Insights
injectSpeedInsights();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
