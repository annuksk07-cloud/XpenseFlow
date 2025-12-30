import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming a base CSS file for globals

// A simple index.css file can be created with this content:
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);