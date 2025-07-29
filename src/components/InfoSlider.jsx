// // import React, { useState, useRef, useEffect } from 'react';

// // const formatTime = (totalSeconds) => {
// //   if (totalSeconds < 0) totalSeconds = 0;
// //   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
// //   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
// //   const seconds = String(totalSeconds % 60).padStart(2, '0');
// //   return `${hours}:${minutes}:${seconds}`;
// // };

// // const CustomInfoDisplay = ({ slot, block, remainingSeconds, virtualTime, stopwatch, currentLapTimes }) => {
// //     let title = '', value = '';
// //     if (slot === 'remainingTime') {
// //         title = '남은 시간';
// //         value = formatTime(remainingSeconds);
// //     } else if (slot === 'virtualTime') {
// //         title = '실제 수능 시간';
// //         value = block.isExam ? virtualTime : "--:--:--";
// //     } else if (slot === 'stopwatch') {
// //         title = '스톱워치';
// //         value = formatTime(stopwatch).substring(3);
// //     } else if (slot === 'lapRecord') {
// //         title = '최근 랩 기록';
// //         value = currentLapTimes.length > 0
// //             ? `랩 ${currentLapTimes.length}: ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
// //             : '기록 없음';
// //     } else {
// //         return null;
// //     }
// //     return (
// //         <div>
// //             <span>{title}</span>
// //             <span>{value}</span>
// //         </div>
// //     );
// // };

// // const InfoSlider = ({ block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, isWarningTime, onLapClick, isCustomizing, customInfo, setCustomInfo, tempLapInfo }) => {
// //     const [currentSlide, setCurrentSlide] = useState(0);
// //     const totalSlides = 4;
// //     const [displayVirtualTime, setDisplayVirtualTime] = useState(virtualTime);

// //     const touchStartRef = useRef(0);
// //     const isDraggingRef = useRef(false);
// //     const sliderRef = useRef(null);

// //     useEffect(() => {
// //         setDisplayVirtualTime(virtualTime);
// //     }, [virtualTime]);

// //     const handleCurrentTimeClick = (e) => {
// //         e.stopPropagation();
// //         const now = new Date().toTimeString().split(' ')[0];
// //         setDisplayVirtualTime(now);
// //     };

// //     const moveSlide = (direction) => {
// //         setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
// //     };

// //     useEffect(() => {
// //         if (sliderRef.current && !isDraggingRef.current) {
// //             const viewportWidth = sliderRef.current.parentElement.offsetWidth;
// //             sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
// //             sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
// //         }
// //     }, [currentSlide]);

// //     const handleTouchStart = (e) => {
// //         isDraggingRef.current = true;
// //         touchStartRef.current = e.touches[0].clientX;
// //         sliderRef.current.style.transition = 'none';
// //     };

// //     const handleTouchMove = (e) => {
// //         if (!isDraggingRef.current) return;
// //         const currentX = e.touches[0].clientX;
// //         const diff = currentX - touchStartRef.current;
// //         const viewportWidth = sliderRef.current.parentElement.offsetWidth;
// //         sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth + diff}px)`;
// //     };

// //     const handleTouchEnd = (e) => {
// //         isDraggingRef.current = false;
// //         const touchEndX = e.changedTouches[0].clientX;
// //         const diff = touchEndX - touchStartRef.current;
// //         const threshold = 50;

// //         if (diff < -threshold) {
// //             moveSlide(1);
// //         } else if (diff > threshold) {
// //             moveSlide(-1);
// //         } else {
// //             const viewportWidth = sliderRef.current.parentElement.offsetWidth;
// //             sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
// //             sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
// //         }
// //     };

// //     // ## 여기가 핵심 수정 부분입니다: getBlockClass 함수 복구 ##
// //     const getBlockClass = (type) => {
// //         if (isWarningTime) return 'warning-text';
// //         if (type === 'break') return 'break-text';
// //         if (type === 'admin' || type === 'prepare' || type === 'bell') return 'admin-text';
// //         return '';
// //     };

// //     return (
// //         <div className="slider-container">
// //             <div className="slider-viewport">
// //                 <div
// //                     className="slider-wrapper"
// //                     ref={sliderRef}
// //                     onTouchStart={handleTouchStart}
// //                     onTouchMove={handleTouchMove}
// //                     onTouchEnd={handleTouchEnd}
// //                 >
// //                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer', position: 'relative' }}>
// //                         <h3>현재 시간 {block.isExam && stopwatch < 30 ? '(클릭 또는 Space)' : ''}</h3>
// //                         <div className={`content ${getBlockClass(block.type)}`} style={{fontSize: '2.5rem'}}>{block.name}</div>
                        
// //                         <div className="custom-info top-right">
// //                             <CustomInfoDisplay slot={customInfo} {...{block, remainingSeconds, virtualTime, stopwatch, currentLapTimes}} />
// //                         </div>
                        
// //                         {tempLapInfo && (
// //                             <div className="temp-lap-display">
// //                                 랩 {tempLapInfo.lapNumber} 기록: {formatTime(tempLapInfo.lapTime).substring(3)}
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer' }}>
// //                         <h3>남은 시간</h3>
// //                         <div className={`content countdown-content ${getBlockClass(block.type)}`}>{formatTime(remainingSeconds)}</div>
// //                     </div>

// //                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer', position: 'relative' }}>
// //                         <h3>실제 수능 시간</h3>
// //                         <div className="current-time-display" onClick={handleCurrentTimeClick}>
// //                             현재 시간: {new Date().toTimeString().split(' ')[0]}
// //                         </div>
// //                         <div className={`content ${getBlockClass(block.type)}`}>
// //                             {block.isExam ? displayVirtualTime : "시험 시간 아님"}
// //                         </div>
// //                     </div>
                    
// //                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer' }}>
// //                         <h3>스톱워치 (클릭 또는 Space)</h3>
// //                         <div className="content">{formatTime(stopwatch).substring(3)}</div>
// //                         <div style={{fontSize: '0.9rem', color: '#555', height: '20px'}}>
// //                             {currentLapTimes.length > 0
// //                                 ? `최근 기록 (랩 ${currentLapTimes.length}): ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
// //                                 : '기록된 랩타임이 없습니다.'
// //                             }
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //             <div className="slider-nav">
// //                 <button onClick={() => moveSlide(-1)}>&#10094;</button>
// //                 <button onClick={() => moveSlide(1)}>&#10095;</button>
// //             </div>
// //             <div className="slider-indicator">
// //                 {[...Array(totalSlides)].map((_, index) => (
// //                     <div
// //                         key={index}
// //                         className={`indicator-dot ${currentSlide === index ? 'active' : ''}`}
// //                     />
// //                 ))}
// //             </div>

// //             {isCustomizing && (
// //                 <div className="customization-menu">
// //                     <label>오른쪽 상단 정보:</label>
// //                     <select value={customInfo} onChange={e => setCustomInfo(e.target.value)}>
// //                         <option value="remainingTime">남은 시간</option>
// //                         <option value="virtualTime">실제 수능 시간</option>
// //                         <option value="stopwatch">스톱워치</option>
// //                         <option value="lapRecord">최근 랩 기록</option>
// //                         <option value="none">표시 안함</option>
// //                     </select>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default InfoSlider;

// import React, { useState, useRef, useEffect } from 'react';

// const formatTime = (totalSeconds) => {
//   if (totalSeconds < 0) totalSeconds = 0;
//   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//   const seconds = String(totalSeconds % 60).padStart(2, '0');
//   return `${hours}:${minutes}:${seconds}`;
// };

// // ## 1. 커스텀 정보를 표시할 작은 컴포넌트 ##
// const CustomInfoDisplay = ({ slot, block, remainingSeconds, virtualTime, stopwatch, currentLapTimes }) => {
//     let title = '', value = '';
//     if (slot === 'remainingTime') {
//         title = '남은 시간';
//         value = formatTime(remainingSeconds);
//     } else if (slot === 'virtualTime') {
//         title = '실제 수능 시간';
//         value = block.isExam ? virtualTime : "--:--:--";
//     } else if (slot === 'stopwatch') {
//         title = '스톱워치';
//         value = formatTime(stopwatch).substring(3);
//     } else if (slot === 'lapRecord') {
//         title = '최근 랩 기록';
//         value = currentLapTimes.length > 0
//             ? `랩 ${currentLapTimes.length}: ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
//             : '기록 없음';
//     } else {
//         return null;
//     }
//     return (
//         <div>
//             <span>{title}</span>
//             <span>{value}</span>
//         </div>
//     );
// };


// const InfoSlider = ({ block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, isWarningTime, onLapClick, isCustomizing, customInfo, setCustomInfo, tempLapInfo }) => {
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const totalSlides = 4;
//     const [displayVirtualTime, setDisplayVirtualTime] = useState(virtualTime);
//     const touchStartRef = useRef(0);
//     const isDraggingRef = useRef(false);
//     const sliderRef = useRef(null);

//     useEffect(() => {
//         setDisplayVirtualTime(virtualTime);
//     }, [virtualTime]);

//     const handleCurrentTimeClick = (e) => {
//         e.stopPropagation();
//         const now = new Date().toTimeString().split(' ')[0];
//         setDisplayVirtualTime(now);
//     };

//     const moveSlide = (direction) => {
//         setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
//     };

//     useEffect(() => {
//         if (sliderRef.current && !isDraggingRef.current) {
//             const viewportWidth = sliderRef.current.parentElement.offsetWidth;
//             sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
//             sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
//         }
//     }, [currentSlide]);

//  const handleTouchStart = (e) => {
//         isDraggingRef.current = true;
//         touchStartRef.current = e.touches[0].clientX;
//         sliderRef.current.style.transition = 'none';
//     };

//     const handleTouchMove = (e) => {
//         if (!isDraggingRef.current) return;
//         const currentX = e.touches[0].clientX;
//         const diff = currentX - touchStartRef.current;
//         const viewportWidth = sliderRef.current.parentElement.offsetWidth;
//         sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth + diff}px)`;
//     };

//     const handleTouchEnd = (e) => {
//         isDraggingRef.current = false;
//         const touchEndX = e.changedTouches[0].clientX;
//         const diff = touchEndX - touchStartRef.current;
//         const threshold = 50;

//         if (diff < -threshold) {
//             moveSlide(1);
//         } else if (diff > threshold) {
//             moveSlide(-1);
//         } else {
//             const viewportWidth = sliderRef.current.parentElement.offsetWidth;
//             sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
//             sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
//         }
//     };
//     const getBlockClass = (type) => {
//         if (isWarningTime) return 'warning-text';
//         if (type === 'break') return 'break-text';
//         if (type === 'admin' || type === 'prepare' || type === 'bell') return 'admin-text';
//         return '';
//     };

//     return (
//         <div className="slider-container">
//             {/* ## 2. 커스텀 정보와 랩 기록을 슬라이더 위에 배치 ## */}
//             <div className="custom-info-overlay top-right">
//                 <CustomInfoDisplay slot={customInfo} {...{block, remainingSeconds, virtualTime, stopwatch, currentLapTimes}} />
//             </div>
//             {tempLapInfo && (
//                 <div className="temp-lap-display">
//                     랩 {tempLapInfo.lapNumber} 기록: {formatTime(tempLapInfo.lapTime).substring(3)}
//                 </div>
//             )}
            
//             {/* ## 3. 원래의 4개 슬라이더 구조 복구 ## */}
//             <div className="slider-viewport">
//                 <div
//                     className="slider-wrapper"
//                     ref={sliderRef}
//                     onTouchStart={handleTouchStart}
//                     onTouchMove={handleTouchMove}
//                     onTouchEnd={handleTouchEnd}
//                 >
//                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer', position: 'relative' }}>
//                         <h3>현재 시간 {block.isExam && stopwatch < 30 ? '(클릭 또는 Space)' : ''}</h3>
//                         <div className={`content ${getBlockClass(block.type)}`} style={{fontSize: '2.5rem'}}>{block.name}</div>
//                     </div>
//                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer' }}>
//                         <h3>남은 시간</h3>
//                         <div className={`content countdown-content ${getBlockClass(block.type)}`}>{formatTime(remainingSeconds)}</div>
//                     </div>
//                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer', position: 'relative' }}>
//                         <h3>실제 수능 시간</h3>
//                         <div className="current-time-display" onClick={handleCurrentTimeClick}>
//                             현재 시간: {new Date().toTimeString().split(' ')[0]}
//                         </div>
//                         <div className={`content ${getBlockClass(block.type)}`}>
//                             {block.isExam ? displayVirtualTime : "시험 시간 아님"}
//                         </div>
//                     </div>
//                     <div className="slide" onClick={onLapClick} style={{ cursor: 'pointer' }}>
//                         <h3>스톱워치 (클릭 또는 Space)</h3>
//                         <div className="content">{formatTime(stopwatch).substring(3)}</div>
//                         <div style={{fontSize: '0.9rem', color: '#555', height: '20px'}}>
//                             {currentLapTimes.length > 0
//                                 ? `최근 기록 (랩 ${currentLapTimes.length}): ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
//                                 : '기록된 랩타임이 없습니다.'
//                             }
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="slider-nav">
//                 <button onClick={() => moveSlide(-1)}>&#10094;</button>
//                 <button onClick={() => moveSlide(1)}>&#10095;</button>
//             </div>
//             <div className="slider-indicator">
//                 {[...Array(totalSlides)].map((_, index) => (
//                     <div
//                         key={index}
//                         className={`indicator-dot ${currentSlide === index ? 'active' : ''}`}
//                     />
//                 ))}
//             </div>

//             {isCustomizing && (
//                 <div className="customization-menu">
//                     <label>오른쪽 상단 정보:</label>
//                     <select value={customInfo} onChange={e => setCustomInfo(e.target.value)}>
//                         <option value="remainingTime">남은 시간</option>
//                         <option value="virtualTime">실제 수능 시간</option>
//                         <option value="stopwatch">스톱워치</option>
//                         <option value="lapRecord">최근 랩 기록</option>
//                         <option value="none">표시 안함</option>
//                     </select>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InfoSlider;
import React, { useState, useRef, useEffect } from 'react';

const formatTime = (totalSeconds) => {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const CustomInfoDisplay = ({ slot, block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, manualVirtualTime }) => {
    let title = '', value = '';
    if (slot === 'blockName') {
        title = '교시 정보';
        value = block.name;
    } else if (slot === 'remainingTime') {
        title = '남은 시간';
        value = formatTime(remainingSeconds);
    } else if (slot === 'virtualTime') {
        title = '실제 수능 시간';
        value = block.isExam ? (manualVirtualTime || virtualTime) : "--:--:--";
    } else if (slot === 'stopwatch') {
        title = '스톱워치';
        value = formatTime(stopwatch).substring(3);
    } else if (slot === 'lapRecord') {
        title = '최근 랩 기록';
        value = currentLapTimes.length > 0
            ? `랩 ${currentLapTimes.length}: ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
            : '기록 없음';
    } else {
        return null;
    }
    return (
        <div className="custom-info-item">
            <span className="custom-info-title">{title}</span>
            <span className="custom-info-value">{value}</span>
        </div>
    );
};

const SlideContent = ({ index, block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, isWarningTime, getBlockClass, manualVirtualTime, setManualVirtualTime, tempLapInfo }) => {
    
    // ## 1. handleCurrentTimeClick 함수를 다시 추가합니다. ##
    const handleCurrentTimeClick = (e) => {
        e.stopPropagation(); // 랩 기록 방지
        if (manualVirtualTime) {
            setManualVirtualTime(null); // 다시 원래 수능 시간으로 복귀
        } else {
            const now = new Date().toTimeString().split(' ')[0];
            setManualVirtualTime(now); // 현재 시간으로 설정
        }
    };

    if (index === 0) {
        return (
            <>
                <h3>현재 시간 {block.isExam && stopwatch < 30 ? '(클릭 또는 Space)' : ''}</h3>
                <div className={`content ${getBlockClass(block.type)}`} style={{fontSize: '2.5rem'}}>{block.name}</div>
                
            </>
        );
    }
    if (index === 1) {
        return (
            <>
                <h3>남은 시간</h3>
                <div className={`content countdown-content ${getBlockClass(block.type)}`}>{formatTime(remainingSeconds)}</div>
            </>
        );
    }
    if (index === 2) {
        return (
            <>
                <h3>{manualVirtualTime ? '현재 시간' : '수능'}</h3>
                <div className={`content ${getBlockClass(block.type)}`}>
                    {block.isExam ? (manualVirtualTime || virtualTime) : "시험 시간 아님"}
                </div>
                {block.isExam && (
                    <div className="time-sync-button" onClick={handleCurrentTimeClick}>
                       {manualVirtualTime ? `수능 시간: (${virtualTime})` : `현재 시간: (${new Date().toTimeString().split(' ')[0]})`}
                    </div>
                )}
            </>
        );
    }
    if (index === 3) {
        return (
            <>
                <h3>스톱워치 (클릭 또는 Space)</h3>
                <div className="content">{formatTime(stopwatch).substring(3)}</div>
                <div style={{fontSize: '0.9rem', color: '#555', height: '20px'}}>
                    {currentLapTimes.length > 0
                        ? `최근 기록 (랩 ${currentLapTimes.length}): ${formatTime(currentLapTimes[currentLapTimes.length - 1].lap).substring(3)}`
                        : '기록된 랩타임이 없습니다.'
                    }
                </div>
            </>
        );
    }
    return null;
};


const InfoSlider = ({ block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, isWarningTime, onLapClick, isCustomizing, slideConfig, setSlideConfig, tempLapInfo, manualVirtualTime, setManualVirtualTime }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 4;
    const touchStartRef = useRef(0);
    const isDraggingRef = useRef(false);
    const sliderRef = useRef(null);

    const moveSlide = (direction) => {
        setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
    };

    useEffect(() => {
        if (sliderRef.current && !isDraggingRef.current) {
            const viewportWidth = sliderRef.current.parentElement.offsetWidth;
            sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
            sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
        }
    }, [currentSlide]);

    const handleTouchStart = (e) => {
        isDraggingRef.current = true;
        touchStartRef.current = e.touches[0].clientX;
        sliderRef.current.style.transition = 'none';
    };
    const handleTouchMove = (e) => {
        if (!isDraggingRef.current) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartRef.current;
        const viewportWidth = sliderRef.current.parentElement.offsetWidth;
        sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth + diff}px)`;
    };
    const handleTouchEnd = (e) => {
        isDraggingRef.current = false;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartRef.current;
        const threshold = 50;
        if (diff < -threshold) { moveSlide(1); } 
        else if (diff > threshold) { moveSlide(-1); } 
        else {
            const viewportWidth = sliderRef.current.parentElement.offsetWidth;
            sliderRef.current.style.transition = 'transform 0.4s ease-in-out';
            sliderRef.current.style.transform = `translateX(${-currentSlide * viewportWidth}px)`;
        }
    };
    
    // ## 여기가 핵심 수정 부분입니다: getBlockClass 함수 복구 ##
    const getBlockClass = (type) => {
        if (isWarningTime) return 'warning-text';
        if (type === 'break' || type === 'lunch') return 'break-text';
        if (type === 'admin' || type === 'prepare' || type === 'bell') return 'admin-text';
        return '';
    };

    const slideOptions = [
        { value: 'none', label: '표시 안함'},
        { value: 'blockName', label: '교시 정보' },
        { value: 'remainingTime', label: '남은 시간' },
        { value: 'virtualTime', label: '실제 수능 시간' },
        { value: 'stopwatch', label: '스톱워치' },
        { value: 'lapRecord', label: '최근 랩 기록' },
    ];
    
    return (
        <div className="slider-container">
            <div className="custom-info-overlay">
                <CustomInfoDisplay slot={slideConfig[`slide${currentSlide}`]} {...{block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, manualVirtualTime}} />
            </div>

            <div className="slider-viewport">
                <div
                    className="slider-wrapper"
                    ref={sliderRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {[...Array(totalSlides)].map((_, index) => (
                        <div className="slide" style={{ position: 'relative' }} key={index}>
                           {/* ## 2. onClick 이벤트를 내부 div로 이동 ## */}
                           <div className="slide-clickable-area" onClick={onLapClick}>
                               <SlideContent 
                                   index={index} 
                                   getBlockClass={getBlockClass} 
                                   {...{block, remainingSeconds, virtualTime, stopwatch, currentLapTimes, isWarningTime, manualVirtualTime, setManualVirtualTime, tempLapInfo}} 
                               />
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {tempLapInfo && (
                <div className="temp-lap-display">
                    랩 {tempLapInfo.lapNumber} 기록: {formatTime(tempLapInfo.lapTime).substring(3)}
                </div>
            )}
            <div className="slider-nav">
                <button onClick={() => moveSlide(-1)}>&#10094;</button>
                <button onClick={() => moveSlide(1)}>&#10095;</button>
            </div>
            <div className="slider-indicator">
                {[...Array(totalSlides)].map((_, index) => (
                    <div
                        key={index}
                        className={`indicator-dot ${currentSlide === index ? 'active' : ''}`}
                    />
                ))}
            </div>
            {isCustomizing && (
                <div className="customization-menu large">
                    <div className="custom-select-group">
                        <label>{currentSlide + 1}번 슬라이드 정보:</label>
                        <select value={slideConfig[`slide${currentSlide}`]} onChange={e => setSlideConfig(p => ({...p, [`slide${currentSlide}`]: e.target.value}))}>
                            {slideOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoSlider;