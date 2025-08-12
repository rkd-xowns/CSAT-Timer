import React from 'react';
// 1. ReactDOM을 'react-dom/client'에서 import 합니다.
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// App.jsx에서 AppWrapper를 기본(default)으로 가져옵니다.
import AppWrapper from './App.jsx'; 
// 기존에 사용하시던 ThemeProvider도 가져옵니다.
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

// AppWrapper를 ThemeProvider와 BrowserRouter로 감싸줍니다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppWrapper />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
