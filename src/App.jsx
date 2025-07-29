import React, { useState } from 'react';
// ## 1. useLocation을 import 목록에 추가 ##
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import MainPage from './pages/MainPage.jsx'; 
import MenuPage from './pages/MenuPage.jsx'; 
import InstructionPage from './pages/InstructionPage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import TestPage from './pages/TestPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import TimerPage from './pages/TimerPage.jsx';
import StopwatchPage from './pages/StopwatchPage.jsx';
import GlobalControls from './components/GlobalControls.jsx';

function App() {
  const [settings, setSettings] = useState(null);
  const [lapData, setLapData] = useState({});
  const [testStatus, setTestStatus] = useState('completed');

  const navigate = useNavigate();
  // ## 2. useLocation 훅을 호출하여 현재 위치 정보를 가져옴 ##
  const location = useLocation();

  const handleStart = (newSettings) => {
    setSettings(newSettings);
    navigate('/test');
  };
  
  const handleFinish = (result) => {
    setLapData(result.data);
    setTestStatus(result.status);
    navigate('/report');
  };

  const handleTimerFinish = (timerResult) => {
    const formattedLapData = {
        "맞춤 타이머 기록": timerResult.laps.map((lapSeconds, index) => ({
            lap: lapSeconds,
            time: `랩 ${index + 1}`
        }))
    };
    setLapData(formattedLapData);
    setTestStatus('completed');
    navigate('/report');
  };

  const handleRestart = () => {
    setSettings(null);
    setLapData({});
    navigate('/main');
  }

  return (
    // ## 3. 현재 경로(location.pathname)가 '/'일 때 'welcome-mode' 클래스를 추가 ##
    <div className={`container ${location.pathname === '/' ? 'welcome-mode' : ''}`}>
      <GlobalControls />
      <Routes>
        <Route path="/" element={<MainPage />} /> 
        <Route path="/menu" element={<MenuPage />} /> 
        <Route path="/instruction" element={<InstructionPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/settings" element={<SettingsPage onStart={handleStart} />} />
        <Route path="/test" element={<TestPage settings={settings} onFinish={handleFinish} />} />
        <Route path="/report" element={<ReportPage lapData={lapData} status={testStatus} onRestart={handleRestart} />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/timer" element={<TimerPage onFinish={handleTimerFinish} />} />
        <Route path="/stopwatch" element={<StopwatchPage />} />
      </Routes>
    </div>
  );
}

export default App;