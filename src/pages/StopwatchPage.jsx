import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const StopwatchPage = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);

  const handleStartStop = useCallback(() => {
    setIsActive(prevIsActive => !prevIsActive);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleStartStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleStartStop]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (timeMs) => {
    const minutes = String(Math.floor(timeMs / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((timeMs / 1000) % 60)).padStart(2, '0');
    const milliseconds = String(Math.floor((timeMs / 10) % 100)).padStart(2, '0');
    return { minutes, seconds, milliseconds };
  };

  const handleLapReset = () => {
    if (isActive) {
      setLaps(prevLaps => [time, ...prevLaps]);
    } else {
      setTime(0);
      setLaps([]);
    }
  };
  
  const displayTime = formatTime(time);

  return (
    <div className="page-container">
      <h2>스톱워치</h2>
      <div className="display-panel" onClick={handleStartStop} style={{ cursor: 'pointer' }}>
        <h3>경과 시간 (클릭 또는 Space)</h3>
        <div className="content stopwatch-content">
          <span>{displayTime.minutes}:{displayTime.seconds}</span>
          <span className="milliseconds">.{displayTime.milliseconds}</span>
        </div>
      </div>

      <div className="stopwatch-controls">
        <button onClick={handleLapReset} className="btn-secondary">
          {isActive ? '랩' : '초기화'}
        </button>
        <button onClick={handleStartStop} style={{backgroundColor: isActive ? '#dc3545' : '#28a745'}}>
          {isActive ? '정지' : '시작'}
        </button>
      </div>

      <div className="laps-pro-list">
        {laps.map((lap, index) => {
          const prevLap = laps[index + 1] || 0;
          const lapTime = formatTime(lap - prevLap);
          const totalTime = formatTime(lap);
          return (
            <div key={index} className="lap-pro-item">
              <span>랩 {laps.length - index}</span>
              <span>+{lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}</span>
              <span>{totalTime.minutes}:{totalTime.seconds}.{totalTime.milliseconds}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
       <Link to="/menu"><button className="btn-secondary">메인으로 돌아가기</button></Link>
      </div>
    </div>
  );
};

export default StopwatchPage;