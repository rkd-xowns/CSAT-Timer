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

// export default TestPage;import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import InfoSlider from '../components/InfoSlider.jsx';
import SimulationLoader from '../components/SimulationLoader.jsx';
import MuteButton from '../components/MuteButton.jsx';
import { buildTestQueue } from '../data/schedule.js';

import preliminarySound from '../assets/preliminary_bell.mp3';
import prepareSound from '../assets/prepare_bell.mp3';
import examStartSound from '../assets/exam_start.mp3';
import examWarningSound from '../assets/exam_warning.mp3';
import examEndSound from '../assets/exam_end.mp3';
import englishPrepareSound from '../assets/english_prepare_sound.mp3';
import fourthPeriodWarningSound from '../assets/fourth_period_warning.mp3';

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

// ✨ 새로운 기능: 알림 표시 헬퍼 함수
const showNotification = (title, options) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
};

const TestPage = ({ settings, onFinish }) => {
    const testQueue = useMemo(() => buildTestQueue(settings), [settings]);
    
    const initialIndex = useMemo(() => {
        if (settings.startMode === 'real-time') {
            return findNextUpcomingBlockIndex(testQueue);
        }
        return 0;
    }, [testQueue, settings.startMode]);

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
        return savedConfig ? JSON.parse(savedConfig) : {
            slide0: 'blockName',
            slide1: 'remainingTime',
            slide2: 'virtualTime',
            slide3: 'stopwatch',
        };
    });
    const [manualVirtualTime, setManualVirtualTime] = useState(null);
    const [tempLapInfo, setTempLapInfo] = useState(null);
    
    // ✨ 새로운 기능: 화면 꺼짐 방지 및 시간 보정용 상태/Ref
    const [wakeLock, setWakeLock] = useState(null);
    const blockEndTimeRef = useRef(null); // 블록 종료 타임스탬프 저장

    useEffect(() => {
        localStorage.setItem('slideConfig', JSON.stringify(slideConfig));
    }, [slideConfig]);

    useEffect(() => {
        audioPlayer.muted = isMuted;
    }, [isMuted]);

    // ✨ 새로운 기능: 컴포넌트 마운트 시 알림 권한 요청
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);
    
    // ✨ 새로운 기능: 화면 꺼짐 방지 (Wake Lock) 관리
    const manageWakeLock = useCallback(async () => {
        if (simState === 'RUNNING' && 'wakeLock' in navigator) {
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                // WakeLock이 예기치 않게 해제될 때를 대비
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
        return () => { if (wakeLock) wakeLock.release(); };
    }, [simState, manageWakeLock, wakeLock]);


    const startBlock = useCallback((block) => {
        if (!block) return;
        setManualVirtualTime(null);
        setCurrentBlock(block);
        setRemainingSeconds(block.duration);
        setStopwatch(0);

        // ✨ 수정된 로직: 블록 종료 시점 저장
        blockEndTimeRef.current = Date.now() + block.duration * 1000;
        
        if (block.isExam && block.startTime) {
            const virtualStartMillis = getTargetTime(block.startTime).getTime();
            setTimeOffset(virtualStartMillis - Date.now());
        } else {
            setTimeOffset(null);
        }
        if (!isMuted) {
            const type = block.type;
            if (block.key === 'english' && settings.listeningFile) {
                playAudio(settings.listeningFile);
            } else if (block.key === 'english_prepare') {
                playAudio(englishPrepareSound);
            } else {
                if (type === 'bell') playAudio(preliminarySound);
                else if (type === 'prepare') playAudio(prepareSound);
                else if (type === 'exam') {
                    playAudio(examStartSound);
                    showNotification(`${block.name} 시작`, {
                        body: '시험이 시작되었습니다. 집중해주세요!',
                        icon: '/logo192.png' // public 폴더의 아이콘 경로
                    });
                }
            }
        }
        setSimState('RUNNING');
    }, [isMuted, settings.listeningFile]);

    const finishBlock = useCallback(() => {
        const nextIndex = currentIndex + 1;
        
        setLapData(currentLapData => {
            let updatedLapData = { ...currentLapData };
            if (currentBlock.key && currentBlock.isExam) {
                const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
                updatedLapData[currentBlock.name] = finalLaps;
            }
            
            if (nextIndex >= testQueue.length) {
                setSimState('FINISHED');
                onFinish({ data: updatedLapData, status: 'completed' });
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
        }
    }, [currentIndex, testQueue, onFinish, currentBlock, currentLapTimes, stopwatch, virtualTime, settings.startMode, startBlock]);

    const handleAbort = () => {
        if (window.confirm("정말로 시뮬레이션을 중단하시겠습니까?")) {
            stopAudio();
            let finalData = lapData;
            if (currentBlock.key && currentBlock.isExam) {
                const finalLaps = [...currentLapTimes, { lap: stopwatch, time: virtualTime }].filter(item => item.lap > 0);
                finalData = { ...lapData, [currentBlock.name]: finalLaps };
            }
            setSimState('FINISHED');
            onFinish({ data: finalData, status: 'aborted' });
        }
    };
    
    // ✨ 수정된 로직: 메인 타이머 로직 전체 변경
    useEffect(() => {
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
                    // ... WAITING 로직은 기존과 동일
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
                        if (!isMuted && currentBlock.isExam) {
                            playAudio(examEndSound);
                            showNotification(`${currentBlock.name} 종료`, {
                                body: '시험이 종료되었습니다. 수고하셨습니다!',
                                icon: '/logo192.png'
                            });
                        }
                        finishBlock();
                        setRemainingSeconds(0);
                    } else {
                        // 10분/5분 경고 알림 로직
                        const key = currentBlock.key;
                        const isFourthPeriod = key === 'history' || key === 'inquiry1' || key === 'inquiry2';
                        
                        // 10분 전
                        if (currentBlock.isExam && newRemaining === 600) {
                            if (!isMuted) playAudio(examWarningSound);
                            showNotification(`${currentBlock.name} 종료 10분 전`, { body: '이제 10분 남았습니다.', icon: '/logo192.png' });
                        }
                        // 5분 전
                        if (currentBlock.isExam && newRemaining === 300) {
                            if (!isMuted) playAudio(isFourthPeriod ? fourthPeriodWarningSound : examWarningSound);
                            showNotification(`${currentBlock.name} 종료 5분 전`, { body: '마킹을 서둘러주세요.', icon: '/logo192.png' });
                        }

                        // 남은 시간 및 스톱워치 업데이트
                        setRemainingSeconds(newRemaining);
                        if (currentBlock.isExam) {
                            // 이전 초와 현재 초의 차이만큼 스톱워치 증가
                            setStopwatch(prev => prev + (remainingSeconds - newRemaining));
                        }
                    }
                    if (timeOffset !== null) {
                        setVirtualTime(new Date(Date.now() + timeOffset).toTimeString().split(' ')[0]);
                    }
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [simState, currentIndex, testQueue, settings.startMode, startBlock, finishBlock, initialIndex, timeOffset, currentBlock, isMuted, remainingSeconds]);
    
    // ✨ 새로운 기능: 앱/탭 복귀 시 시간 보정
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && simState === 'RUNNING') {
                // 앱이 다시 활성화되면 즉시 시간 보정
                const newRemaining = Math.round((blockEndTimeRef.current - Date.now()) / 1000);
                setRemainingSeconds(newRemaining > 0 ? newRemaining : 0);
                
                // WakeLock이 해제되었을 수 있으므로 다시 요청
                manageWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [simState, manageWakeLock]);

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
            }, 10000);

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
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>{settings.startMode === 'real-time' ? '실제 수능 시간 모드' : '시뮬레이션 준비'}</h2>
                <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>{waitingMessage}</p>
                <p style={{ color: '#555' }}>{initialIndex === -1 ? '' : '다음 시간이 되면 자동으로 시작됩니다.'}</p>
                <button onClick={handleAbort} className="btn-secondary" style={{marginTop: '1rem'}}>중단하기</button>
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
                isWarningTime={false} // isWarningTime 상태를 더 이상 사용하지 않음
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