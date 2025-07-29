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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    const [isWarningTime, setIsWarningTime] = useState(false);
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

    useEffect(() => {
        localStorage.setItem('slideConfig', JSON.stringify(slideConfig));
    }, [slideConfig]);

    useEffect(() => {
        audioPlayer.muted = isMuted;
    }, [isMuted]);

    const startBlock = useCallback((block) => {
        if (!block) return;
        setManualVirtualTime(null);
        setCurrentBlock(block);
        setRemainingSeconds(block.duration);
        setStopwatch(0);
        setIsWarningTime(false);
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
                else if (type === 'exam') playAudio(examStartSound);
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
                    setRemainingSeconds(prev => {
                        if (prev <= 1) {
                            if (!isMuted && currentBlock.isExam) playAudio(examEndSound);
                            finishBlock();
                            return 0;
                        }
                        const newRemaining = prev - 1;
                        if (currentBlock.key === 'english_prepare' && newRemaining === 180 && settings.listeningFile) {
                            if (!isMuted) playAudio(settings.listeningFile);
                        }
                        const key = currentBlock.key;
                        const isFourthPeriod = key === 'history' || key === 'inquiry1' || key === 'inquiry2';
                        const warningTime = isFourthPeriod ? 300 : 600;
                        if (currentBlock.isExam && newRemaining === warningTime) {
                            if (!isMuted) {
                                playAudio(isFourthPeriod ? fourthPeriodWarningSound : examWarningSound);
                            }
                            setIsWarningTime(true);
                        }
                        return newRemaining;
                    });
                    if (currentBlock.isExam) setStopwatch(prev => prev + 1);
                    if (timeOffset !== null) setVirtualTime(new Date(Date.now() + timeOffset).toTimeString().split(' ')[0]);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [simState, settings, testQueue, currentIndex, timeOffset, finishBlock, startBlock, initialIndex]);
    
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
            <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%'}}>
                <div className="loader-page-container">
                    <h2>실제 수능 시간 모드</h2>
                    <div className="loader">
                        <div className="truckWrapper">
                            <svg className="lampPost" width="0" height="0" viewBox="0 0 62 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60.5 88.5H1.5" stroke="black" strokeWidth="3"/><path d="M12 88.5V2H15V88.5H12Z" fill="#282828"/><path d="M15 13.25H48.5C54.0228 13.25 58.5 17.7272 58.5 23.25V24.25C58.5 29.7728 54.0228 34.25 48.5 34.25H29" stroke="#282828" strokeWidth="3"/><path d="M49 33C53.4183 33 57 29.4183 57 25C57 20.5817 53.4183 17 49 17C44.5817 17 41 20.5817 41 25C41 29.4183 44.5817 33 49 33Z" fill="#FBFF3C"/></svg>
                            <div className="truckBody"><svg width="171" height="92" viewBox="0 0 198 93" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" fill="#F83D3D" stroke="#282828" strokeWidth="3"/><path d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" fill="#7D7C7C" stroke="#282828" strokeWidth="3"/><path d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" fill="#282828" stroke="#282828" strokeWidth="2"/><rect x="187" y="63" width="5" height="7" rx="1" fill="#FFFCAB" stroke="#282828" strokeWidth="2"/><rect x="193" y="81" width="4" height="11" rx="1" fill="#282828" stroke="#282828" strokeWidth="2"/><rect x="6.5" y="1.5" width="121" height="90" rx="2.5" fill="#DFDFDF" stroke="#282828" strokeWidth="3"/><rect x="1" y="84" width="6" height="4" rx="2" fill="#DFDFDF" stroke="#282828" strokeWidth="2"/></svg></div>
                    <div className="truckTires"><svg width="26" height="26" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="13.5" fill="#282828" stroke="#282828" strokeWidth="3"/><circle cx="15" cy="15" r="7" fill="#DFDFDF"/></svg><svg width="26" height="26" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="13.5" fill="#282828" stroke="#282828" strokeWidth="3"/><circle cx="15" cy="15" r="7" fill="#DFDFDF"/></svg></div>
                    <div className="road"></div>
                </div>
            </div>
            <p style={{ fontSize: '1.25rem', margin: '1rem 0', color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
                    {waitingMessage}
                </p>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                {initialIndex === -1 ? '' : '다음 시간이 되면 자동으로 시작됩니다.'}
            </p>
            <button onClick={handleAbort} className="neumorphic-button" style={{marginTop: '1rem'}}>중단하기</button>
        </div>
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
                isWarningTime={isWarningTime}
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