// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import InfoSlider from '../components/InfoSlider.jsx';
// import SimulationLoader from '../components/SimulationLoader.jsx';
// import MuteButton from '../components/MuteButton.jsx';
// import { buildTestQueue } from '../data/schedule.js';

// // --- 오디오 파일 임포트 ---
// import preliminarySound from '../assets/preliminary_bell.mp3';
// import prepareSound from '../assets/prepare_bell.mp3';
// import examStartSound from '../assets/exam_start.mp3';
// import examWarningSound from '../assets/exam_warning.mp3';
// import examEndSound from '../assets/exam_end.mp3';
// import englishPrepareSound from '../assets/english_prepare_sound.mp3';
// import fourthPeriodWarningSound from '../assets/fourth_period_warning.mp3';

// // --- 오디오 플레이어 ---
// const audioPlayer = new Audio();
// const playAudio = (audioSrc) => {
//     if (audioSrc) {
//         audioPlayer.src = audioSrc;
//         audioPlayer.play().catch(e => console.error("오디오 재생 오류:", e));
//     }
// };
// const stopAudio = () => {
//     audioPlayer.pause();
//     audioPlayer.currentTime = 0;
// };

// // --- 유틸리티 함수 ---
// const getTargetTime = (timeString) => {
//     const target = new Date();
//     const [h, m, s] = timeString.split(':').map(Number);
//     target.setHours(h, m, s, 0);
//     return target;
// };

// const findNextUpcomingBlockIndex = (queue) => {
//     const now = new Date();
//     for (let i = 0; i < queue.length; i++) {
//         const block = queue[i];
//         if (block.startTime) {
//             if (getTargetTime(block.startTime) > now) {
//                 return i;
//             }
//         }
//     }
//     return -1;
// };

// // --- 푸시 알림 관련 헬퍼 함수 (이 부분이 누락되었습니다) ---
// const API_URL = 'https://7a6f1fa2bccc.ngrok-free.app'; // 로컬 백엔드 서버 주소 (모바일 테스트 시 ngrok 주소로 변경 필요)

// const urlBase64ToUint8Array = (base64String) => {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
// };

// const sendPushNotificationRequest = (subscription, payload) => {
//     if (!subscription) return;
//     fetch(`${API_URL}/api/send-notification`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ subscription, ...payload }),
//     }).catch(console.error);
// };


// const TestPage = ({ settings, onFinish }) => {
//     const testQueue = useMemo(() => buildTestQueue(settings), [settings]);
    
//     const initialIndex = useMemo(() => {
//         if (settings.startMode === 'real-time') {
//             return findNextUpcomingBlockIndex(testQueue);
//         }
//         return 0;
//     }, [testQueue, settings.startMode]);
    
//     // --- 상태 (State) 선언 ---
//     const [simState, setSimState] = useState('PREPARING'); 
//     const [waitingMessage, setWaitingMessage] = useState("시뮬레이션을 준비 중입니다...");
//     const [currentIndex, setCurrentIndex] = useState(initialIndex);
//     const [currentBlock, setCurrentBlock] = useState({ name: "준비 중...", type: 'admin', isExam: false, key: 'prepare' });
//     const [remainingSeconds, setRemainingSeconds] = useState(10);
//     const [timeOffset, setTimeOffset] = useState(null);
//     const [virtualTime, setVirtualTime] = useState("");
//     const [isMuted, setIsMuted] = useState(false);
//     const [stopwatch, setStopwatch] = useState(0);
//     const [lapData, setLapData] = useState({});
//     const [currentLapTimes, setCurrentLapTimes] = useState([]);
//     const [isUiHidden, setIsUiHidden] = useState(false);
//     const [isStartEnabled, setIsStartEnabled] = useState(false);
//     const [isCustomizing, setIsCustomizing] = useState(false);
//     const [slideConfig, setSlideConfig] = useState(() => {
//         const savedConfig = localStorage.getItem('slideConfig');
//         return savedConfig ? JSON.parse(savedConfig) : { slide0: 'blockName', slide1: 'remainingTime', slide2: 'virtualTime', slide3: 'stopwatch' };
//     });
//     const [manualVirtualTime, setManualVirtualTime] = useState(null);
//     const [tempLapInfo, setTempLapInfo] = useState(null);
//     const [wakeLock, setWakeLock] = useState(null);
//     const blockEndTimeRef = useRef(null);

//     // 푸시 알림 상태
//     const [pushSubscription, setPushSubscription] = useState(null);
//     const [isSubscribing, setIsSubscribing] = useState(false);

//     useEffect(() => {
//         localStorage.setItem('slideConfig', JSON.stringify(slideConfig));
//     }, [slideConfig]);

//     useEffect(() => {
//         audioPlayer.muted = isMuted;
//     }, [isMuted]);

//     const manageWakeLock = useCallback(async () => {
//         if (simState === 'RUNNING' && 'wakeLock' in navigator) {
//             try {
//                 const lock = await navigator.wakeLock.request('screen');
//                 setWakeLock(lock);
//                 lock.addEventListener('release', () => setWakeLock(null));
//             } catch (err) {
//                 console.error(`${err.name}, ${err.message}`);
//             }
//         } else {
//             if (wakeLock) {
//                 wakeLock.release();
//                 setWakeLock(null);
//             }
//         }
//     }, [simState, wakeLock]);

//     useEffect(() => {
//         manageWakeLock();
//         return () => { if (wakeLock) wakeLock.release() };
//     }, [simState, manageWakeLock, wakeLock]);


//     // --- 푸시 알림 구독 처리 ---
//     const handleSubscribeToPush = useCallback(async () => {
//         if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//             alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
//             return;
//         }

//         setIsSubscribing(true);
//         try {
//             const registration = await navigator.serviceWorker.register('/sw.js');
//             let subscription = await registration.pushManager.getSubscription();

//             if (subscription) {
//                 setPushSubscription(subscription);
//             } else {
//                 const res = await fetch(`${API_URL}/api/vapid-public-key`);
//                 const vapidPublicKey = await res.text();
//                 const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

//                 subscription = await registration.pushManager.subscribe({
//                     userVisibleOnly: true,
//                     applicationServerKey: convertedVapidKey,
//                 });
//                 setPushSubscription(subscription);

//                 await fetch(`${API_URL}/api/subscribe`, {
//                     method: 'POST',
//                     body: JSON.stringify(subscription),
//                     headers: { 'Content-Type': 'application/json' },
//                 });
//             }
//             alert('알림이 허용되었습니다!');
//         } catch (error) {
//             console.error('푸시 구독 실패:', error);
//             alert('알림 허용에 실패했습니다. 브라우저 설정을 확인해주세요.');
//         } finally {
//             setIsSubscribing(false);
//         }
//     }, []);

//     const startBlock = useCallback((block) => {
//         if (!block) return;
//         setManualVirtualTime(null);
//         setCurrentBlock(block);
//         setRemainingSeconds(block.duration);
//         setStopwatch(0);
        
//         blockEndTimeRef.current = Date.now() + block.duration * 1000;

//         if (block.isExam && block.startTime) {
//             const virtualStartMillis = getTargetTime(block.startTime).getTime();
//             setTimeOffset(virtualStartMillis - Date.now());
//         } else {
//             setTimeOffset(null);
//         }
//         if (!isMuted) {
//             const type = block.type;
//             if (block.key === 'english' && settings.listeningFile) playAudio(settings.listeningFile);
//             else if (block.key === 'english_prepare') playAudio(englishPrepareSound);
//             else {
//                 if (type === 'bell') playAudio(preliminarySound);
//                 else if (type === 'prepare') playAudio(prepareSound);
//                 else if (type === 'exam') playAudio(examStartSound);
//             }
//         }
//         setSimState('RUNNING');

//         if (block.isExam) {
//             sendPushNotificationRequest(pushSubscription, {
//                 title: `${block.name} 시작`,
//                 body: '시험이 시작되었습니다. 집중력을 발휘해 주세요!',
//             });
//         }
//     }, [isMuted, settings.listeningFile, pushSubscription]);

//     const finishBlock = useCallback(() => {
//         const nextIndex = currentIndex + 1;
        
//         setLapData(currentLapData => {
//             let updatedLapData = { ...currentLapData };
//             if (currentBlock.key && currentBlock.isExam) {
//                 const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
//                 updatedLapData[currentBlock.name] = finalLaps;
//             }
//             if (nextIndex >= testQueue.length) {
//                 return updatedLapData;
//             }
//             return updatedLapData;
//         });
        
//         setCurrentLapTimes([]);
//         if (nextIndex < testQueue.length) {
//             setCurrentIndex(nextIndex);
//             if (settings.startMode === 'immediate') {
//                 startBlock(testQueue[nextIndex]);
//             } else {
//                 setSimState('WAITING');
//             }
//         } else {
//             setSimState('FINISHED');
//         }
//     }, [currentIndex, testQueue, currentBlock, currentLapTimes, stopwatch, virtualTime, settings.startMode, startBlock]);
    
//     const handleAbort = () => {
//         if (window.confirm("정말로 시뮬레이션을 중단하시겠습니까?")) {
//             stopAudio();
//             let finalData = lapData;
//             if (currentBlock.key && currentBlock.isExam) {
//                 const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
//                 finalData = { ...lapData, [currentBlock.name]: finalLaps };
//             }
//             onFinish({ data: finalData, status: 'aborted' });
//             setSimState('FINISHED');
//         }
//     };
    
//     useEffect(() => {
//         if (simState === 'FINISHED') {
//             onFinish({ data: lapData, status: 'completed' });
//             return;
//         }

//         if (simState === 'PREPARING') {
//             if (settings.startMode === 'real-time' && initialIndex === -1) {
//                 setWaitingMessage("오늘의 모든 시뮬레이션 시간이 지났습니다.");
//                 return;
//             }
//             if (settings.startMode === 'immediate') {
//                 const loaderTimer = setTimeout(() => { setIsStartEnabled(true); }, 10000);
//                 return () => clearTimeout(loaderTimer);
//             } else {
//                 setSimState('WAITING');
//             }
//             return;
//         }

//         if (simState === 'WAITING' || simState === 'RUNNING') {
//             const timer = setInterval(() => {
//                 if (simState === 'WAITING') {
//                     const nextBlock = testQueue[currentIndex];
//                     if (!nextBlock) return;
//                     if (!nextBlock.startTime && settings.startMode === 'real-time') {
//                         startBlock(nextBlock);
//                         return;
//                     }
//                     const targetTime = getTargetTime(nextBlock.startTime);
//                     const diff = targetTime.getTime() - Date.now();
//                     if (diff <= 0) {
//                         startBlock(nextBlock);
//                     } else {
//                         const hours = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
//                         const minutes = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
//                         const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
//                         setWaitingMessage(`${nextBlock.name} 시작까지 ${hours}:${minutes}:${seconds} 남았습니다.`);
//                     }
//                 } else if (simState === 'RUNNING') {
//                     const newRemaining = Math.round((blockEndTimeRef.current - Date.now()) / 1000);

//                     if (newRemaining <= 0) {
//                         if (currentBlock.isExam) {
//                             if (!isMuted) playAudio(examEndSound);
//                             sendPushNotificationRequest(pushSubscription, {
//                                 title: `${currentBlock.name} 종료`,
//                                 body: '시험이 종료되었습니다. 수고하셨습니다!',
//                             });
//                         }
//                         finishBlock();
//                         setRemainingSeconds(0);
//                     } else {
//                         setRemainingSeconds(newRemaining);
//                         if (currentBlock.isExam) {
//                              setStopwatch(prev => prev + (remainingSeconds - newRemaining));
//                         }
//                         if (timeOffset !== null) {
//                             setVirtualTime(new Date(Date.now() + timeOffset).toTimeString().split(' ')[0]);
//                         }
                        
//                         if (currentBlock.key === 'english_prepare' && newRemaining === 180 && settings.listeningFile) {
//                             if (!isMuted) playAudio(settings.listeningFile);
//                         }

//                         if (currentBlock.isExam && newRemaining === 10) {
//                             if (!isMuted) playAudio(examWarningSound);
//                             sendPushNotificationRequest(pushSubscription, {
//                                 title: `${currentBlock.name} 종료 10분 전`,
//                                 body: '마무리와 검토를 시작할 시간입니다.',
//                             });
//                         }

//                         if (currentBlock.isExam && newRemaining === 5) {
//                             const isFourthPeriod = currentBlock.key === 'history' || currentBlock.key === 'inquiry1' || currentBlock.key === 'inquiry2';
//                             if (!isMuted) {
//                                 playAudio(isFourthPeriod ? fourthPeriodWarningSound : examWarningSound);
//                             }
//                             sendPushNotificationRequest(pushSubscription, {
//                                 title: `${currentBlock.name} 종료 5분 전`,
//                                 body: '답안지 마킹을 최종 확인해 주세요.',
//                             });
//                         }
//                     }
//                 }
//             }, 1000);
//             return () => clearInterval(timer);
//         }
//     }, [simState, settings.startMode, currentIndex, testQueue, timeOffset, finishBlock, startBlock, initialIndex, onFinish, lapData, isMuted, settings.listeningFile, pushSubscription, currentBlock, remainingSeconds]);
    
//     useEffect(() => {
//         const handleVisibilityChange = () => {
//             if (document.visibilityState === 'visible' && simState === 'RUNNING') {
//                 const newRemaining = Math.round((blockEndTimeRef.current - Date.now()) / 1000);
//                 if (newRemaining > 0) {
//                     const elapsedSecondsInBackground = remainingSeconds - newRemaining;
//                     setRemainingSeconds(newRemaining);
//                     if (currentBlock.isExam) {
//                         setStopwatch(prev => prev + elapsedSecondsInBackground);
//                     }
//                 } else {
//                     setRemainingSeconds(0);
//                     finishBlock();
//                 }
//                 manageWakeLock();
//             }
//         };

//         document.addEventListener('visibilitychange', handleVisibilityChange);
//         return () => {
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//         };
//     }, [simState, remainingSeconds, currentBlock.isExam, finishBlock, manageWakeLock]);

//     const handleLap = useCallback(() => {
//         if (currentBlock.isExam) {
//             const newLap = { lap: stopwatch, time: virtualTime };
//             setCurrentLapTimes(prev => [...prev, newLap]);
            
//             setTempLapInfo({
//                 lapNumber: currentLapTimes.length + 1,
//                 lapTime: stopwatch
//             });
//             setTimeout(() => {
//                 setTempLapInfo(null);
//             }, 5000);

//             setStopwatch(0);
//         }
//     }, [currentBlock.isExam, stopwatch, virtualTime, currentLapTimes.length]);

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.code === 'Space') { e.preventDefault(); handleLap(); }
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleLap]);

//     if (simState === 'PREPARING' || simState === 'WAITING') {
//         if (simState === 'PREPARING' && settings.startMode === 'immediate') {
//     return (
//         <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%', flexDirection: 'column'}}>
//             <SimulationLoader isStartEnabled={isStartEnabled} onStart={() => startBlock(testQueue[0])} />

//             {/* ✨ 이 부분이 추가되었습니다. */}
//             <div style={{ marginTop: '2rem', textAlign: 'center' }}>
//                 {!pushSubscription && (
//                     <button onClick={handleSubscribeToPush} disabled={isSubscribing} className="neumorphic-button">
//                         {isSubscribing ? '처리 중...' : '시험 시간 알림 켜기'}
//                     </button>
//                 )}
//                 {pushSubscription && <p style={{ color: 'green' }}>✅ 알림이 활성화되었습니다.</p>}
//             </div>
//         </div>
//     );
// }
//         return (
//             <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%', flexDirection: 'column'}}>
//                 <div className="loader-page-container">
//                     <h2>실제 수능 시간 모드</h2>
//                     <div className="loader">
//                         {/* 로더 SVG 코드... */}
//                     </div>
//                 </div>
//                 <p style={{ fontSize: '1.25rem', margin: '1rem 0', color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
//                     {waitingMessage}
//                 </p>
//                 <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
//                     {initialIndex === -1 ? '' : '다음 시간이 되면 자동으로 시작됩니다.'}
//                 </p>

//                 {!pushSubscription && (
//                     <button onClick={handleSubscribeToPush} disabled={isSubscribing} className="neumorphic-button" style={{marginTop: '2rem'}}>
//                         {isSubscribing ? '처리 중...' : '시험 시간 알림 켜기'}
//                     </button>
//                 )}
//                 {pushSubscription && <p style={{marginTop: '1rem', color: 'green'}}>✅ 알림이 활성화되었습니다.</p>}ㅅ
                
//                 <button onClick={handleAbort} className="neumorphic-button" style={{marginTop: '1rem'}}>중단하기</button>
//             </div>
//         );
//     }
    
   
//     return (
//         <div className={`test-page-container ${isUiHidden ? 'ui-hidden' : ''}`}>
//             <button onClick={() => setIsUiHidden(prev => !prev)} className="btn-icon ui-toggle-button">
//                 {isUiHidden ? '👁️' : '🙈'}
//             </button>

//             <div className="top-ui-bar">
//                 <div className="left-controls">
//                     <h2>시뮬레이션 진행 중</h2>
//                 </div>
//                 <div className="right-controls">
//                     <button onClick={() => setIsCustomizing(prev => !prev)} className="neumorphic-button">
//                         {isCustomizing ? '완료' : '커스텀'}
//                     </button>
//                     <button onClick={handleAbort} className="neumorphic-button">중단</button>
//                     <MuteButton isMuted={isMuted} onToggle={() => setIsMuted(prev => !prev)} />
//                 </div>
//             </div>

//             <InfoSlider
//                 block={currentBlock}
//                 remainingSeconds={remainingSeconds}
//                 virtualTime={virtualTime}
//                 stopwatch={stopwatch}
//                 currentLapTimes={currentLapTimes}
//                 isWarningTime={false}
//                 onLapClick={handleLap}
//                 isCustomizing={isCustomizing}
//                 slideConfig={slideConfig}
//                 setSlideConfig={setSlideConfig}
//                 tempLapInfo={tempLapInfo}
//                 manualVirtualTime={manualVirtualTime}
//                 setManualVirtualTime={setManualVirtualTime}
//             />
//         </div>
//     );
// };

// export default TestPage;

import React, { useMemo, useState } from 'react';
import { buildTestQueue } from '../data/schedule.js';

// --- API 서버 주소 ---
const API_URL = 'https://bbfbfbc02cb8.ngrok-free.app'; // ⚠️ 반드시 현재 ngrok 주소로 변경해주세요.

// --- 헬퍼 함수 ---
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};


const TestPage = ({ settings, onFinish }) => {
    const [subscriptionStatus, setSubscriptionStatus] = useState('아직 시도 안함');

    const handleSubscribe = async () => {
        setSubscriptionStatus('1. 구독 절차 시작...');
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                throw new Error('이 브라우저는 서비스 워커 또는 푸시 알림을 지원하지 않습니다.');
            }

            setSubscriptionStatus('2. 서비스 워커 등록 시도...');
            const registration = await navigator.serviceWorker.register('/sw.js');
            setSubscriptionStatus('3. 서비스 워커 등록 성공!');

            setSubscriptionStatus('4. VAPID 공개 키 가져오기 시도...');
            const res = await fetch(`${API_URL}/api/vapid-public-key`);
            if (!res.ok) {
                throw new Error(`VAPID 키 서버 응답 실패: ${res.status}`);
            }
            const vapidPublicKey = await res.text();
            setSubscriptionStatus('5. VAPID 키 수신 성공!');

            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            setSubscriptionStatus('6. Push Manager 구독 시도 (이때 실제 권한 팝업이 떠야 합니다)...');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });
            setSubscriptionStatus('7. 구독 성공! 알림이 설정되었습니다.');
            console.log("구독 성공!", subscription);

            // 구독 정보를 백엔드에 저장
             await fetch(`${API_URL}/api/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (error) {
            console.error("구독 실패 지점:", error);
            setSubscriptionStatus(`구독 실패: ${error.message}`);
        }
    };

    // settings가 없을 경우를 대비한 방어 코드
    if (!settings) {
        return <div>오류: settings가 없습니다. 이전 페이지로 돌아가세요.</div>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'black', background: 'white', height: '100vh' }}>
            <h1>알림 기능 테스트 페이지</h1>
            <p>아래 버튼을 눌러 브라우저의 실제 알림 허용 팝업이 뜨는지 확인하세요.</p>
            
            <button onClick={handleSubscribe} style={{ padding: '15px 25px', fontSize: '18px' }}>
                실제 권한 팝업 띄우기
            </button>

            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', background: '#f0f0f0' }}>
                <h3>현재 상태:</h3>
                <p style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{subscriptionStatus}</p>
            </div>
        </div>
    );
};

export default TestPage;