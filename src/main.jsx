import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router'; 
import './index.css';
import { App } from './app/App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}