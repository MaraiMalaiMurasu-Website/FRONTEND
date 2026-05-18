import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './styles/ticker.css';
import './styles/headlines.css';
import './styles/ads.css';
import './styles/astrology.css';
import './styles/article.css';
import './styles/category.css';
import './styles/admin.css';
import './styles/responsive.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
