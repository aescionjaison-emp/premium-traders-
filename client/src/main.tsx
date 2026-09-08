import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import './index.css';
import './firebase/firebaseConfig.js';

// Contexts
import { AuthProvider } from './context/AuthContext.js';
import { SettingsProvider } from './context/SettingsContext.js';
import { QuickViewProvider } from './context/QuickViewContext.js';
import { ToastProvider } from './context/ToastContext.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <QuickViewProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </QuickViewProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
