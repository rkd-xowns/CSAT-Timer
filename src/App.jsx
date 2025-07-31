import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // 사용자 기기가 아이패드인지, 아니면 스마트폰인지 구분합니다.
    const userAgent = navigator.userAgent;
    const isTablet = /iPad/i.test(userAgent);
    const isPhone = /iPhone|iPod|Android/i.test(userAgent) && !isTablet;

    const lockOrientation = async (orientation) => {
      try {
        await screen.orientation.lock(orientation);
      } catch (err) {
        // 사용자가 허용하지 않는 등 오류는 무시합니다.
      }
    };

    const unlockOrientation = () => {
      try {
        screen.orientation.unlock();
      } catch (err) {
        // 오류는 무시합니다.
      }
    };

    // 아이패드일 경우, 항상 고정을 해제합니다.
    if (isTablet) {
      unlockOrientation();
    } 
    // 스마트폰일 경우, 경로에 따라 고정 여부를 결정합니다.
    else if (isPhone) {
      if (location.pathname === '/test') {
        unlockOrientation(); // TestPage에서는 고정 해제
      } else {
        lockOrientation('portrait-primary'); // 나머지 페이지는 세로로 고정
      }
    }

    return () => unlockOrientation();

  }, [location.pathname]); // 경로가 변경될 때마다 이 로직을 다시 실행합니다.


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

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { EventProvider, useEvent } from './context/EventContext.jsx'; 
// import FireworksEvent from './components/FireworksEvent.jsx';

// // 페이지 및 컴포넌트 import
// import MainPage from './pages/MainPage.jsx'; 
// import MenuPage from './pages/MenuPage.jsx'; 
// import InstructionPage from './pages/InstructionPage.jsx';
// import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
// import SettingsPage from './pages/SettingsPage.jsx';
// import TestPage from './pages/TestPage.jsx';
// import ReportPage from './pages/ReportPage.jsx';
// import FeedbackPage from './pages/FeedbackPage.jsx';
// import TimerPage from './pages/TimerPage.jsx';
// import StopwatchPage from './pages/StopwatchPage.jsx';
// import GlobalControls from './components/GlobalControls.jsx';

// // 실제 앱의 내용을 담는 컴포넌트
// function App() {
//   // isEventActive 상태와 startEvent/endEvent 함수를 Context에서 가져옵니다.
//   const { isEventActive, startEvent, endEvent } = useEvent();
  
//   const [settings, setSettings] = useState(null);
//   const [lapData, setLapData] = useState({});
//   const [testStatus, setTestStatus] = useState('completed');

//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // --- 타이머 로직 ---
//   useEffect(() => {
//     // 예시: 2025년 8월 1일 오전 3시 30분에 이벤트 시작
//     const eventTime = new Date('2025-08-01T04:34:00');
//     const now = new Date();
    
//     const timeToEvent = eventTime.getTime() - now.getTime();
    
//     // 이벤트 시간이 아직 지나지 않았다면 타이머 설정
//     if (timeToEvent > 0) {
//       const timer = setTimeout(() => {
//         startEvent();
//       }, timeToEvent);
      
//       // 컴포넌트가 사라질 때 타이머 정리
//       return () => clearTimeout(timer);
//     }
//   }, [startEvent]);

//   const handleStart = (newSettings) => {
//     setSettings(newSettings);
//     navigate('/test');
//   };
  
//   const handleFinish = (result) => {
//     setLapData(result.data);
//     setTestStatus(result.status);
//     navigate('/report');
//   };

//   const handleTimerFinish = (timerResult) => {
//     const formattedLapData = {
//         "맞춤 타이머 기록": timerResult.laps.map((lapSeconds, index) => ({
//             lap: lapSeconds,
//             time: `랩 ${index + 1}`
//         }))
//     };
//     setLapData(formattedLapData);
//     setTestStatus('completed');
//     navigate('/report');
//   };

//   const handleRestart = () => {
//     setSettings(null);
//     setLapData({});
//     navigate('/main');
//   };
  
//   // 이벤트가 끝났을 때 호출될 함수
//   const handleEventComplete = () => {
//     console.log("Fireworks event has finished!");
//     endEvent(); // isEventActive를 false로 만들어 컴포넌트를 사라지게 함
//   };

//   // 표시할 문구 설정 (여러 줄 예시)
//   const intro = ["수능 대박을", "기원합니다!"];
//   const outro = ["모든 수험생 여러분", "정말 수고하셨습니다."];

//   return (
//     <>
//       {isEventActive && (
//         <FireworksEvent
//           introText={intro}
//           outroText={outro}
//           onComplete={handleEventComplete}
//         />
//       )}
      
//       <div className={`container ${location.pathname === '/' ? 'welcome-mode' : ''}`}>
//         <GlobalControls />
//         <Routes>
//           <Route path="/" element={<MainPage />} /> 
//           <Route path="/menu" element={<MenuPage />} /> 
//           <Route path="/instruction" element={<InstructionPage />} />
//           <Route path="/announcements" element={<AnnouncementsPage />} />
//           <Route path="/settings" element={<SettingsPage onStart={handleStart} />} />
//           <Route path="/test" element={<TestPage settings={settings} onFinish={handleFinish} />} />
//           <Route path="/report" element={<ReportPage lapData={lapData} status={testStatus} onRestart={handleRestart} />} />
//           <Route path="/feedback" element={<FeedbackPage />} />
//           <Route path="/timer" element={<TimerPage onFinish={handleTimerFinish} />} />
//           <Route path="/stopwatch" element={<StopwatchPage />} />
//         </Routes>
//       </div>
//     </>
//   );
// }

// // Context Provider로 App을 감싸는 최상위 Wrapper 컴포넌트
// function AppWrapper() {
//   return (
//     <EventProvider>
//       <App />
//     </EventProvider>
//   );
// }

// export default AppWrapper;