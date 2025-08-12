// // import React, { useState } from 'react';
// // // ## 1. useLocation을 import 목록에 추가 ##
// // import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';


// // import MainPage from './pages/MainPage.jsx'; 
// // import MenuPage from './pages/MenuPage.jsx'; 
// // import InstructionPage from './pages/InstructionPage.jsx';
// // import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
// // import SettingsPage from './pages/SettingsPage.jsx';
// // import TestPage from './pages/TestPage.jsx';
// // import ReportPage from './pages/ReportPage.jsx';
// // import FeedbackPage from './pages/FeedbackPage.jsx';
// // import TimerPage from './pages/TimerPage.jsx';
// // import StopwatchPage from './pages/StopwatchPage.jsx';
// // import GlobalControls from './components/GlobalControls.jsx';

// // function App() {
// //   const [settings, setSettings] = useState(null);
// //   const [lapData, setLapData] = useState({});
// //   const [testStatus, setTestStatus] = useState('completed');

// //   const navigate = useNavigate();
// //   // ## 2. useLocation 훅을 호출하여 현재 위치 정보를 가져옴 ##
// //   const location = useLocation();

// //   const handleStart = (newSettings) => {
// //     setSettings(newSettings);
// //     navigate('/test');
// //   };
  
// //   const handleFinish = (result) => {
// //     setLapData(result.data);
// //     setTestStatus(result.status);
// //     navigate('/report');
// //   };

// //   const handleTimerFinish = (timerResult) => {
// //     const formattedLapData = {
// //         "맞춤 타이머 기록": timerResult.laps.map((lapSeconds, index) => ({
// //             lap: lapSeconds,
// //             time: `랩 ${index + 1}`
// //         }))
// //     };
// //     setLapData(formattedLapData);
// //     setTestStatus('completed');
// //     navigate('/report');
// //   };

// //   const handleRestart = () => {
// //     setSettings(null);
// //     setLapData({});
// //     navigate('/main');
// //   }

// //   return (
// //     // ## 3. 현재 경로(location.pathname)가 '/'일 때 'welcome-mode' 클래스를 추가 ##
// //     <div className={`container ${location.pathname === '/' ? 'welcome-mode' : ''}`}>
// //       <GlobalControls />
// //       <Routes>
// //         <Route path="/" element={<MainPage />} /> 
// //         <Route path="/menu" element={<MenuPage />} /> 
// //         <Route path="/instruction" element={<InstructionPage />} />
// //         <Route path="/announcements" element={<AnnouncementsPage />} />
// //         <Route path="/settings" element={<SettingsPage onStart={handleStart} />} />
// //         <Route path="/test" element={<TestPage settings={settings} onFinish={handleFinish} />} />
// //         <Route path="/report" element={<ReportPage lapData={lapData} status={testStatus} onRestart={handleRestart} />} />
// //         <Route path="/feedback" element={<FeedbackPage />} />
// //         <Route path="/timer" element={<TimerPage onFinish={handleTimerFinish} />} />
// //         <Route path="/stopwatch" element={<StopwatchPage />} />
// //       </Routes>
// //     </div>
// //   );
// // }

// // export default App;

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
//     const eventTime = new Date('2025-08-01T09:49:00');
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
//   const intro = ["수능 대박 기원!", "마지막 모고시합 다들 수고하셨습니다!"];
//   const outro = ["다옭국어 화이팅!", "태준: 곧 끝나유~"];

  

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

// export default AppWrapper;import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { EventProvider, useEvent } from './context/EventContext.jsx';
import FireworksEvent from './components/FireworksEvent.jsx';

// 페이지 및 컴포넌트 import
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

// VAPID 공개 키를 Vercel 환경 변수에서 가져옵니다.
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// VAPID 키를 변환하는 헬퍼 함수
function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    console.error("urlBase64ToUint8Array: base64String is invalid.");
    return new Uint8Array(0);
  }
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 실제 앱의 내용을 담는 컴포넌트
function App() {
  const { isEventActive, startEvent, endEvent } = useEvent();
  
  const [settings, setSettings] = useState(null);
  const [lapData, setLapData] = useState({});
  const [testStatus, setTestStatus] = useState('completed');
  const [pushSupport, setPushSupport] = useState(false);
  const [userConsent, setUserConsent] = useState(Notification.permission);

  const navigate = useNavigate();
  const location = useLocation();
  
  // 컴포넌트 마운트 시 푸시 지원 여부만 확인
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupport(true);
    }
  }, []);

  // 테스트 알림 발송 및 권한 요청 함수
  const handleSendTestNotification = async () => {
    if (!pushSupport) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    let currentPermission = Notification.permission;

    // 1. 권한이 아직 결정되지 않았다면, 사용자에게 요청 (User Gesture!)
    if (currentPermission === 'default') {
      currentPermission = await Notification.requestPermission();
      setUserConsent(currentPermission); // 상태 업데이트
    }

    // 2. 사용자가 권한을 거부했다면, 안내 메시지 표시
    if (currentPermission === 'denied') {
      alert('알림 권한이 차단되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      return;
    }

    // 3. 사용자가 권한을 허용했다면, 구독 및 알림 발송
    if (currentPermission === 'granted') {
      try {
        const swRegistration = await navigator.serviceWorker.ready;
        let subscription = await swRegistration.pushManager.getSubscription();

        // 구독 정보가 없다면 새로 생성
        if (subscription === null) {
          if (!VAPID_PUBLIC_KEY) {
            console.error("Vercel 환경 변수에 VITE_VAPID_PUBLIC_KEY가 설정되지 않았습니다.");
            alert("푸시 알림 설정에 문제가 있습니다. (관리자에게 문의)");
            return;
          }
          subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          });
        }
        
        // 서버로 구독 정보 보내서 알림 발송 요청
        await fetch('/api/send-notification', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' },
        });
        alert('테스트 알림을 성공적으로 요청했습니다! 잠시 후 알림을 확인하세요.');

      } catch (error) {
        console.error('푸시 알림 처리 중 오류 발생:', error);
        alert('알림 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // 기존 로직들...
  const handleStart = (newSettings) => { setSettings(newSettings); navigate('/test'); };
  const handleFinish = (result) => { setLapData(result.data); setTestStatus(result.status); navigate('/report'); };
  const handleTimerFinish = (timerResult) => {
    const formattedLapData = { "맞춤 타이머 기록": timerResult.laps.map((lapSeconds, index) => ({ lap: lapSeconds, time: `랩 ${index + 1}` })) };
    setLapData(formattedLapData); setTestStatus('completed'); navigate('/report');
  };
  const handleRestart = () => { setSettings(null); setLapData({}); navigate('/main'); };
  const handleEventComplete = () => { console.log("Fireworks event has finished!"); endEvent(); };
  const intro = ["수능 대박 기원!", "마지막 모고시합 다들 수고하셨습니다!"];
  const outro = ["다옭국어 화이팅!", "태준: 곧 끝나유~"];

  return (
    <>
      {isEventActive && <FireworksEvent introText={intro} outroText={outro} onComplete={handleEventComplete} />}
      <div className={`container ${location.pathname === '/' ? 'welcome-mode' : ''}`}>
        <GlobalControls />
        {/* 테스트 알림 버튼 추가 */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
          <button onClick={handleSendTestNotification} disabled={!pushSupport || userConsent === 'denied'}>
            {userConsent === 'denied' ? '알림 차단됨' : '테스트 알림 보내기'}
          </button>
        </div>
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
    </>
  );
}

function AppWrapper() {
  return (
    <EventProvider>
      <App />
    </EventProvider>
  );
}

export default AppWrapper;
