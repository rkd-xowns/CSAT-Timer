// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import InfoSlider from '../components/InfoSlider.jsx';
// import SimulationLoader from '../components/SimulationLoader.jsx';
// import MuteButton from '../components/MuteButton.jsx';
// import { buildTestQueue } from '../data/schedule.js';

// import preliminarySound from '../assets/preliminary_bell.mp3';
// import prepareSound from '../assets/prepare_bell.mp3';
// import examStartSound from '../assets/exam_start.mp3';
// import examWarningSound from '../assets/exam_warning.mp3';
// import examEndSound from '../assets/exam_end.mp3';
// import englishPrepareSound from '../assets/english_prepare_sound.mp3';
// import fourthPeriodWarningSound from '../assets/fourth_period_warning.mp3';

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

// const TestPage = ({ settings, onFinish }) => {
//     const testQueue = useMemo(() => buildTestQueue(settings), [settings]);
    
//     const initialIndex = useMemo(() => {
//         if (settings.startMode === 'real-time') {
//             return findNextUpcomingBlockIndex(testQueue);
//         }
//         return 0;
//     }, [testQueue, settings.startMode]);

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
//     const [isWarningTime, setIsWarningTime] = useState(false);
//     const [isUiHidden, setIsUiHidden] = useState(false);
//     const [isStartEnabled, setIsStartEnabled] = useState(false);
    
//     const [isCustomizing, setIsCustomizing] = useState(false);
//     const [slideConfig, setSlideConfig] = useState(() => {
//         const savedConfig = localStorage.getItem('slideConfig');
//         return savedConfig ? JSON.parse(savedConfig) : {
//             slide0: 'blockName',
//             slide1: 'remainingTime',
//             slide2: 'virtualTime',
//             slide3: 'stopwatch',
//         };
//     });
//     const [manualVirtualTime, setManualVirtualTime] = useState(null);
//     const [tempLapInfo, setTempLapInfo] = useState(null);

//     useEffect(() => {
//         localStorage.setItem('slideConfig', JSON.stringify(slideConfig));
//     }, [slideConfig]);

//     useEffect(() => {
//         audioPlayer.muted = isMuted;
//     }, [isMuted]);

//     const startBlock = useCallback((block) => {
//         if (!block) return;
//         setManualVirtualTime(null);
//         setCurrentBlock(block);
//         setRemainingSeconds(block.duration);
//         setStopwatch(0);
//         setIsWarningTime(false);
//         if (block.isExam && block.startTime) {
//             const virtualStartMillis = getTargetTime(block.startTime).getTime();
//             setTimeOffset(virtualStartMillis - Date.now());
//         } else {
//             setTimeOffset(null);
//         }
//         if (!isMuted) {
//             const type = block.type;
//             if (block.key === 'english' && settings.listeningFile) {
//                 playAudio(settings.listeningFile);
//             } else if (block.key === 'english_prepare') {
//                 playAudio(englishPrepareSound);
//             } else {
//                 if (type === 'bell') playAudio(preliminarySound);
//                 else if (type === 'prepare') playAudio(prepareSound);
//                 else if (type === 'exam') playAudio(examStartSound);
//             }
//         }
//         setSimState('RUNNING');
//     }, [isMuted, settings.listeningFile]);

//     const finishBlock = useCallback(() => {
//         const nextIndex = currentIndex + 1;
        
//         setLapData(currentLapData => {
//             let updatedLapData = { ...currentLapData };
//             if (currentBlock.key && currentBlock.isExam) {
//                 const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
//                 updatedLapData[currentBlock.name] = finalLaps;
//             }
            
//             if (nextIndex >= testQueue.length) {
//                 setSimState('FINISHED');
//                 onFinish({ data: updatedLapData, status: 'completed' });
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
//         }
//     }, [currentIndex, testQueue, onFinish, currentBlock, currentLapTimes, stopwatch, virtualTime, settings.startMode, startBlock]);

//     const handleAbort = () => {
//         if (window.confirm("정말로 시뮬레이션을 중단하시겠습니까?")) {
//             stopAudio();
//             let finalData = lapData;
//             if (currentBlock.key && currentBlock.isExam) {
//                 const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
//                 finalData = { ...lapData, [currentBlock.name]: finalLaps };
//             }
//             setSimState('FINISHED');
//             onFinish({ data: finalData, status: 'aborted' });
//         }
//     };
    
//     useEffect(() => {
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
//                     setRemainingSeconds(prev => {
//                         if (prev <= 1) {
//                             if (!isMuted && currentBlock.isExam) playAudio(examEndSound);
//                             finishBlock();
//                             return 0;
//                         }
//                         const newRemaining = prev - 1;
//                         if (currentBlock.key === 'english_prepare' && newRemaining === 180 && settings.listeningFile) {
//                             if (!isMuted) playAudio(settings.listeningFile);
//                         }
//                         const key = currentBlock.key;
//                         const isFourthPeriod = key === 'history' || key === 'inquiry1' || key === 'inquiry2';
//                         const warningTime = isFourthPeriod ? 300 : 600;
//                         if (currentBlock.isExam && newRemaining === warningTime) {
//                             if (!isMuted) {
//                                 playAudio(isFourthPeriod ? fourthPeriodWarningSound : examWarningSound);
//                             }
//                             setIsWarningTime(true);
//                         }
//                         return newRemaining;
//                     });
//                     if (currentBlock.isExam) setStopwatch(prev => prev + 1);
//                     if (timeOffset !== null) setVirtualTime(new Date(Date.now() + timeOffset).toTimeString().split(' ')[0]);
//                 }
//             }, 1000);
//             return () => clearInterval(timer);
//         }
//     }, [simState, currentIndex]);
    
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
//             }, 10000);

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
//             return (
//                 <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%'}}>
//                     <SimulationLoader isStartEnabled={isStartEnabled} onStart={() => startBlock(testQueue[0])} />
//                 </div>
//             );
//         }
//         return (
//             <div style={{ textAlign: 'center', padding: '4rem 0' }}>
//                 <h2>{settings.startMode === 'real-time' ? '실제 수능 시간 모드' : '시뮬레이션 준비'}</h2>
//                 <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>{waitingMessage}</p>
//                 <p style={{ color: '#555' }}>{initialIndex === -1 ? '' : '다음 시간이 되면 자동으로 시작됩니다.'}</p>
//                 <button onClick={handleAbort} className="btn-secondary" style={{marginTop: '1rem'}}>중단하기</button>
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
//                 isWarningTime={isWarningTime}
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
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import InfoSlider from '../components/InfoSlider.jsx';
import SimulationLoader from '../components/SimulationLoader.jsx';
import MuteButton from '../components/MuteButton.jsx';
import { buildTestQueue } from '../data/schedule.js';

// --- 오디오 파일 임포트 ---
import preliminarySound from '../assets/preliminary_bell.mp3';
import prepareSound from '../assets/prepare_bell.mp3';
import examStartSound from '../assets/exam_start.mp3';
import examWarningSound from '../assets/exam_warning.mp3';
import examEndSound from '../assets/exam_end.mp3';
import englishPrepareSound from '../assets/english_prepare_sound.mp3';
import fourthPeriodWarningSound from '../assets/fourth_period_warning.mp3';

// --- 오디오 플레이어 ---
const audioPlayer = new Audio();
const playAudio = (audioSrc) => {
    if (audioSrc) {
        audioPlayer.src = audioSrc;
        audioPlayer.play().catch(e => console.error("오디오 재생 오류:", e));
    }
};
const stopAudio = () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
};

// --- 유틸리티 함수 ---
const getTargetTime = (timeString) => {
    const target = new Date();
    const [h, m, s] = timeString.split(':').map(Number);
    target.setHours(h, m, s, 0);
    return target;
};

const findNextUpcomingBlockIndex = (queue) => {
    const now = new Date();
    for (let i = 0; i < queue.length; i++) {
        const block = queue[i];
        if (block.startTime) {
            if (getTargetTime(block.startTime) > now) {
                return i;
            }
        }
    }
    return -1;
};


// --- 푸시 알림 관련 헬퍼 함수 ---
//const API_URL = 'http://localhost:4000'; // 로컬 백엔드 서버 주소 (모바일 테스트 시 ngrok 주소로 변경 필요)
const API_URL = 'https://19c9c9cc2f64.ngrok-free.app'; // 2단계에서 얻은 백엔드 서버용 ngrok 주소로 변경

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

const sendPushNotificationRequest = (subscription, payload) => {
    if (!subscription) return;
    fetch(`${API_URL}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, ...payload }),
    }).catch(console.error);
};


const TestPage = ({ settings, onFinish }) => {
    const testQueue = useMemo(() => buildTestQueue(settings), [settings]);
    
    const initialIndex = useMemo(() => {
        if (settings.startMode === 'real-time') {
            return findNextUpcomingBlockIndex(testQueue);
        }
        return 0;
    }, [testQueue, settings.startMode]);
    
    // --- 상태 (State) 선언 ---
    const [simState, setSimState] = useState('PREPARING'); 
    const [waitingMessage, setWaitingMessage] = useState("시뮬레이션을 준비 중입니다...");
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [currentBlock, setCurrentBlock] = useState({ name: "준비 중...", type: 'admin', isExam: false, key: 'prepare' });
    const [remainingSeconds, setRemainingSeconds] = useState(10);
    const [timeOffset, setTimeOffset] = useState(null);
    const [virtualTime, setVirtualTime] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [stopwatch, setStopwatch] = useState(0);
    const [lapData, setLapData] = useState({});
    const [currentLapTimes, setCurrentLapTimes] = useState([]);
    const [isUiHidden, setIsUiHidden] = useState(false);
    const [isStartEnabled, setIsStartEnabled] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [slideConfig, setSlideConfig] = useState(() => {
        const savedConfig = localStorage.getItem('slideConfig');
        return savedConfig ? JSON.parse(savedConfig) : { slide0: 'blockName', slide1: 'remainingTime', slide2: 'virtualTime', slide3: 'stopwatch' };
    });
    const [manualVirtualTime, setManualVirtualTime] = useState(null);
    const [tempLapInfo, setTempLapInfo] = useState(null);
    const [wakeLock, setWakeLock] = useState(null);
    const blockEndTimeRef = useRef(null);

    // 푸시 알림 상태
    const [pushSubscription, setPushSubscription] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        localStorage.setItem('slideConfig', JSON.stringify(slideConfig));
    }, [slideConfig]);

    useEffect(() => {
        audioPlayer.muted = isMuted;
    }, [isMuted]);

    const manageWakeLock = useCallback(async () => {
        if (simState === 'RUNNING' && 'wakeLock' in navigator) {
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                lock.addEventListener('release', () => setWakeLock(null));
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        } else {
            if (wakeLock) {
                wakeLock.release();
                setWakeLock(null);
            }
        }
    }, [simState, wakeLock]);

    useEffect(() => {
        manageWakeLock();
        return () => { if (wakeLock) wakeLock.release() };
    }, [simState, manageWakeLock, wakeLock]);


    // --- 푸시 알림 구독 처리 ---
    const handleSubscribeToPush = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
            return;
        }

        setIsSubscribing(true);
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            let subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                setPushSubscription(subscription);
            } else {
                const res = await fetch(`${API_URL}/api/vapid-public-key`);
                const vapidPublicKey = await res.text();
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey,
                });
                setPushSubscription(subscription);

                await fetch(`${API_URL}/api/subscribe`, {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            alert('알림이 허용되었습니다!');
        } catch (error) {
            console.error('푸시 구독 실패:', error);
            alert('알림 허용에 실패했습니다. 브라우저 설정을 확인해주세요.');
        } finally {
            setIsSubscribing(false);
        }
    }, []);

    const startBlock = useCallback((block) => {
        if (!block) return;
        setManualVirtualTime(null);
        setCurrentBlock(block);
        setRemainingSeconds(block.duration);
        setStopwatch(0);
        
        blockEndTimeRef.current = Date.now() + block.duration * 1000;

        if (block.isExam && block.startTime) {
            const virtualStartMillis = getTargetTime(block.startTime).getTime();
            setTimeOffset(virtualStartMillis - Date.now());
        } else {
            setTimeOffset(null);
        }
        if (!isMuted) {
            const type = block.type;
            if (block.key === 'english' && settings.listeningFile) playAudio(settings.listeningFile);
            else if (block.key === 'english_prepare') playAudio(englishPrepareSound);
            else {
                if (type === 'bell') playAudio(preliminarySound);
                else if (type === 'prepare') playAudio(prepareSound);
                else if (type === 'exam') playAudio(examStartSound);
            }
        }
        setSimState('RUNNING');

        if (block.isExam) {
            sendPushNotificationRequest(pushSubscription, {
                title: `${block.name} 시작`,
                body: '시험이 시작되었습니다. 집중력을 발휘해 주세요!',
            });
        }
    }, [isMuted, settings.listeningFile, pushSubscription]);

    const finishBlock = useCallback(() => {
        const nextIndex = currentIndex + 1;
        
        setLapData(currentLapData => {
            let updatedLapData = { ...currentLapData };
            if (currentBlock.key && currentBlock.isExam) {
                const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
                updatedLapData[currentBlock.name] = finalLaps;
            }
            if (nextIndex >= testQueue.length) {
                return updatedLapData;
            }
            return updatedLapData;
        });
        
        setCurrentLapTimes([]);
        if (nextIndex < testQueue.length) {
            setCurrentIndex(nextIndex);
            if (settings.startMode === 'immediate') {
                startBlock(testQueue[nextIndex]);
            } else {
                setSimState('WAITING');
            }
        } else {
            setSimState('FINISHED');
        }
    }, [currentIndex, testQueue, currentBlock, currentLapTimes, stopwatch, virtualTime, settings.startMode, startBlock]);
    
    const handleAbort = () => {
        if (window.confirm("정말로 시뮬레이션을 중단하시겠습니까?")) {
            stopAudio();
            let finalData = lapData;
            if (currentBlock.key && currentBlock.isExam) {
                const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
                finalData = { ...lapData, [currentBlock.name]: finalLaps };
            }
            onFinish({ data: finalData, status: 'aborted' });
            setSimState('FINISHED');
        }
    };
    
    useEffect(() => {
        if (simState === 'FINISHED') {
            onFinish({ data: lapData, status: 'completed' });
            return;
        }

        if (simState === 'PREPARING') {
            if (settings.startMode === 'real-time' && initialIndex === -1) {
                setWaitingMessage("오늘의 모든 시뮬레이션 시간이 지났습니다.");
                return;
            }
            if (settings.startMode === 'immediate') {
                const loaderTimer = setTimeout(() => { setIsStartEnabled(true); }, 10000);
                return () => clearTimeout(loaderTimer);
            } else {
                setSimState('WAITING');
            }
            return;
        }

        if (simState === 'WAITING' || simState === 'RUNNING') {
            const timer = setInterval(() => {
                if (simState === 'WAITING') {
                    const nextBlock = testQueue[currentIndex];
                    if (!nextBlock) return;
                    if (!nextBlock.startTime && settings.startMode === 'real-time') {
                        startBlock(nextBlock);
                        return;
                    }
                    const targetTime = getTargetTime(nextBlock.startTime);
                    const diff = targetTime.getTime() - Date.now();
                    if (diff <= 0) {
                        startBlock(nextBlock);
                    } else {
                        const hours = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
                        const minutes = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
                        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
                        setWaitingMessage(`${nextBlock.name} 시작까지 ${hours}:${minutes}:${seconds} 남았습니다.`);
                    }
                } else if (simState === 'RUNNING') {
                    const newRemaining = Math.round((blockEndTimeRef.current - Date.now()) / 1000);

                    if (newRemaining <= 0) {
                        if (currentBlock.isExam) {
                            if (!isMuted) playAudio(examEndSound);
                            sendPushNotificationRequest(pushSubscription, {
                                title: `${currentBlock.name} 종료`,
                                body: '시험이 종료되었습니다. 수고하셨습니다!',
                            });
                        }
                        finishBlock();
                        setRemainingSeconds(0);
                    } else {
                        setRemainingSeconds(newRemaining);
                        if (currentBlock.isExam) {
                             setStopwatch(prev => prev + (remainingSeconds - newRemaining));
                        }
                        if (timeOffset !== null) {
                            setVirtualTime(new Date(Date.now() + timeOffset).toTimeString().split(' ')[0]);
                        }
                        
                        if (currentBlock.key === 'english_prepare' && newRemaining === 180 && settings.listeningFile) {
                            if (!isMuted) playAudio(settings.listeningFile);
                        }

                        if (currentBlock.isExam && newRemaining === 600) {
                            if (!isMuted) playAudio(examWarningSound);
                            sendPushNotificationRequest(pushSubscription, {
                                title: `${currentBlock.name} 종료 10분 전`,
                                body: '마무리와 검토를 시작할 시간입니다.',
                            });
                        }

                        if (currentBlock.isExam && newRemaining === 300) {
                            const isFourthPeriod = currentBlock.key === 'history' || currentBlock.key === 'inquiry1' || currentBlock.key === 'inquiry2';
                            if (!isMuted) {
                                playAudio(isFourthPeriod ? fourthPeriodWarningSound : examWarningSound);
                            }
                            sendPushNotificationRequest(pushSubscription, {
                                title: `${currentBlock.name} 종료 5분 전`,
                                body: '답안지 마킹을 최종 확인해 주세요.',
                            });
                        }
                    }
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [simState, settings.startMode, currentIndex, testQueue, timeOffset, finishBlock, startBlock, initialIndex, onFinish, lapData, isMuted, settings.listeningFile, pushSubscription, currentBlock, remainingSeconds]);
    
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && simState === 'RUNNING') {
                const newRemaining = Math.round((blockEndTimeRef.current - Date.now()) / 1000);
                if (newRemaining > 0) {
                    const elapsedSecondsInBackground = remainingSeconds - newRemaining;
                    setRemainingSeconds(newRemaining);
                    if (currentBlock.isExam) {
                        setStopwatch(prev => prev + elapsedSecondsInBackground);
                    }
                } else {
                    setRemainingSeconds(0);
                    finishBlock();
                }
                manageWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [simState, remainingSeconds, currentBlock.isExam, finishBlock, manageWakeLock]);

    const handleLap = useCallback(() => {
        if (currentBlock.isExam) {
            const newLap = { lap: stopwatch, time: virtualTime };
            setCurrentLapTimes(prev => [...prev, newLap]);
            
            setTempLapInfo({
                lapNumber: currentLapTimes.length + 1,
                lapTime: stopwatch
            });
            setTimeout(() => {
                setTempLapInfo(null);
            }, 5000);

            setStopwatch(0);
        }
    }, [currentBlock.isExam, stopwatch, virtualTime, currentLapTimes.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') { e.preventDefault(); handleLap(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleLap]);

    if (simState === 'PREPARING' || simState === 'WAITING') {
        if (simState === 'PREPARING' && settings.startMode === 'immediate') {
            return (
                <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%'}}>
                    <SimulationLoader isStartEnabled={isStartEnabled} onStart={() => startBlock(testQueue[0])} />
                </div>
            );
        }
        return (
            <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%', flexDirection: 'column'}}>
                <div className="loader-page-container">
                    <h2>실제 수능 시간 모드</h2>
                    {/* ... SVG 로더 코드 ... */}
                </div>
                <p style={{ fontSize: '1.25rem', margin: '1rem 0', color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
                    {waitingMessage}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                    {initialIndex === -1 ? '' : '다음 시간이 되면 자동으로 시작됩니다.'}
                </p>

                {!pushSubscription && (
                    <button onClick={handleSubscribeToPush} disabled={isSubscribing} className="neumorphic-button" style={{marginTop: '2rem'}}>
                        {isSubscribing ? '처리 중...' : '시험 시간 알림 켜기'}
                    </button>
                )}
                {pushSubscription && <p style={{marginTop: '1rem', color: 'green'}}>✅ 알림이 활성화되었습니다.</p>}
                
                <button onClick={handleAbort} className="neumorphic-button" style={{marginTop: '1rem'}}>중단하기</button>
            </div>
        );
    }
    
   
    return (
        <div className={`test-page-container ${isUiHidden ? 'ui-hidden' : ''}`}>
            <button onClick={() => setIsUiHidden(prev => !prev)} className="btn-icon ui-toggle-button">
                {isUiHidden ? '👁️' : '🙈'}
            </button>

            <div className="top-ui-bar">
                <div className="left-controls">
                    <h2>시뮬레이션 진행 중</h2>
                </div>
                <div className="right-controls">
                    <button onClick={() => setIsCustomizing(prev => !prev)} className="neumorphic-button">
                        {isCustomizing ? '완료' : '커스텀'}
                    </button>
                    <button onClick={handleAbort} className="neumorphic-button">중단</button>
                    <MuteButton isMuted={isMuted} onToggle={() => setIsMuted(prev => !prev)} />
                </div>
            </div>

            <InfoSlider
                block={currentBlock}
                remainingSeconds={remainingSeconds}
                virtualTime={virtualTime}
                stopwatch={stopwatch}
                currentLapTimes={currentLapTimes}
                isWarningTime={false}
                onLapClick={handleLap}
                isCustomizing={isCustomizing}
                slideConfig={slideConfig}
                setSlideConfig={setSlideConfig}
                tempLapInfo={tempLapInfo}
                manualVirtualTime={manualVirtualTime}
                setManualVirtualTime={setManualVirtualTime}
            />
        </div>
    );
};

export default TestPage;