import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1. App.jsx에서 AppWrapper를 기본(default)으로 가져옵니다.
import AppWrapper from './App.jsx'; 
// 2. 기존에 사용하시던 ThemeProvider도 가져옵니다.
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

// 3. AppWrapper를 ThemeProvider와 BrowserRouter로 감싸줍니다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppWrapper />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);