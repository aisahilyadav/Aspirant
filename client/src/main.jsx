import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Override native window.alert with a minimal brutalist toast notification system
window.alert = (message) => {
  let container = document.getElementById('minimal-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'minimal-toast-container';
    container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  
  let bgColor = 'bg-black';
  let borderColor = 'border-white/10';
  let textColor = 'text-white';
  let dotColor = 'bg-white';

  const cleanMessage = message.toString();
  if (cleanMessage.includes('🎉') || cleanMessage.includes('✅') || cleanMessage.toLowerCase().includes('success')) {
    bgColor = 'bg-[#0a0a0c]';
    borderColor = 'border-green-500/20';
    textColor = 'text-green-300';
    dotColor = 'bg-green-400';
  } else if (cleanMessage.toLowerCase().includes('failed') || cleanMessage.toLowerCase().includes('error') || cleanMessage.toLowerCase().includes('invalid')) {
    bgColor = 'bg-[#0a0a0c]';
    borderColor = 'border-red-500/20';
    textColor = 'text-red-300';
    dotColor = 'bg-red-400';
  } else {
    bgColor = 'bg-[#0a0a0c]';
    borderColor = 'border-white/10';
    textColor = 'text-white';
    dotColor = 'bg-gray-400';
  }

  toast.className = `flex items-center justify-between gap-4 p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} shadow-2xl backdrop-blur-md translate-x-12 opacity-0 transition-all duration-300 ease-out pointer-events-auto cursor-pointer`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse"></span>
      <span class="text-[10px] font-extrabold uppercase tracking-widest leading-relaxed">${cleanMessage.replace(/[🎉✅🔴🟢⚪]/g, '').trim()}</span>
    </div>
    <button class="text-gray-500 hover:text-white transition-colors text-[10px] font-bold">✕</button>
  `;

  const closeToast = () => {
    toast.className = `flex items-center justify-between gap-4 p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} shadow-2xl backdrop-blur-md translate-x-12 opacity-0 transition-all duration-300 ease-out pointer-events-none`;
    setTimeout(() => toast.remove(), 300);
  };

  toast.addEventListener('click', closeToast);

  container.appendChild(toast);
  toast.offsetHeight; // Force reflow
  toast.className = `flex items-center justify-between gap-4 p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} shadow-2xl backdrop-blur-md translate-x-0 opacity-100 transition-all duration-300 ease-out pointer-events-auto cursor-pointer`;

  setTimeout(closeToast, 4000);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="906396846679-6uassoiom86hq9vdr4mb5s06s9tmjrqe.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);