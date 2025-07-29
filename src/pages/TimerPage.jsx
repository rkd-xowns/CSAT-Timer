import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import alarm1Sound from '../assets/alarm1.mp3';
import alarm2Sound from '../assets/alarm2.mp3';
import alarm3Sound from '../assets/alarm3.mp3';

const playAudio = (audioSrc) => {
    if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play().catch(e => console.error("오디오 재생 오류:", e));
    }
};

const alarmOptions = [
    { name: '기본 벨', src: alarm1Sound },
    { name: '사이렌', src: alarm2Sound },
    { name: '기상음', src: alarm3Sound },
];

const TimerPage = ({ onFinish }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [selectedAlarm, setSelectedAlarm] = useState(alarmOptions[0].src);

  const [stopwatch, setStopwatch] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isLapStarted, setIsLapStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setTotalSeconds(minutes * 60 + seconds);
    }
  }, [minutes, seconds, isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
        if (isLapStarted) {
          setStopwatch(prev => prev + 1);
        }
      }, 1000);
    } else if (totalSeconds === 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      playAudio(selectedAlarm);
      onFinish({ laps: [...laps, stopwatch].filter(l => l > 0) });
    }
    return () => clearInterval(interval);
  }, [isActive, totalSeconds, isLapStarted, laps, stopwatch, onFinish, selectedAlarm]);

  const formatTimeToString = (timeInSeconds) => {
    const mins = String(Math.floor(timeInSeconds / 60)).padStart(2, '0');
    const secs = String(timeInSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleStart = () => {
    setIsEditing(false);
    const newTotal = minutes * 60 + seconds;
    if (newTotal > 0) {
      setTotalSeconds(newTotal);
      setIsActive(true);
      setIsPaused(false);
      setIsLapStarted(false);
      setStopwatch(0);
      setLaps([]);
    }
  };

  const handlePauseResume = () => {
    setIsEditing(false);
    setIsActive(!isActive);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsEditing(false);
    setIsActive(false);
    setIsPaused(false);
    setTotalSeconds(minutes * 60 + seconds);
    setIsLapStarted(false);
    setStopwatch(0);
    setLaps([]);
  };

  const handleLap = useCallback(() => {
    if (!isActive) return;
    if (isLapStarted) {
      setLaps(prev => [...prev, stopwatch]);
      setStopwatch(0);
      setIsLapStarted(false);
    } else {
      setIsLapStarted(true);
    }
  }, [isActive, isLapStarted, stopwatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleLap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLap]);

  const handleDisplayClick = () => {
    if (!isActive) {
      setIsEditing(true);
    } else {
      handleLap();
    }
  };
  
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const display = formatTimeToString(totalSeconds);

  return (
    <div className="page-container">
      <h2>맞춤 타이머</h2>
      <div className="display-panel" onClick={handleDisplayClick}>
        <h3>{isEditing ? "시간 입력 후 Enter" : (isActive ? "남은 시간" : "시간을 클릭하여 수정")}</h3>
        <div className="content timer-content">
          {isEditing ? (
            <>
              <input type="number" className="inline-input" value={minutes} onChange={e => setMinutes(Math.max(0, Number(e.target.value)))} onKeyDown={handleInputKeyDown} autoFocus />
              <span>:</span>
              <input type="number" className="inline-input" value={seconds} onChange={e => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} onKeyDown={handleInputKeyDown}/>
            </>
          ) : ( <span>{display}</span> )}
        </div>
        {isActive && (
          <p style={{ fontSize: '0.8rem', color: '#888', margin: '10px 0 0 0', fontWeight: 'normal' }}>
            {isLapStarted ? 'Space / 클릭하여 랩 기록' : 'Space / 클릭하여 랩 시작'}
          </p>
        )}
      </div>

      <div className="setting-group" style={{ textAlign: 'center' }}>
        <label htmlFor="alarm-select" style={{ marginRight: '10px' }}>알림음:</label>
        <select 
            id="alarm-select"
            value={selectedAlarm}
            onChange={e => setSelectedAlarm(e.target.value)}
            style={{ fontSize: '1rem', padding: '5px' }}
        >
            {alarmOptions.map(option => (
                <option key={option.name} value={option.src}>{option.name}</option>
            ))}
        </select>
      </div>

      <div style={{ textAlign: 'center' }}>
        {!isActive && !isPaused ? ( <button onClick={handleStart}>시작</button> ) 
        : ( <button onClick={handlePauseResume}>{isActive ? '일시정지' : '계속'}</button> )}
        <button onClick={handleReset}>초기화</button>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '1rem', height: '30px', fontSize: '1.2rem'}}>
        {isLapStarted || laps.length > 0 ? (
          <>
            <span>{laps.length > 0 ? `최근 랩: ${formatTimeToString(laps[laps.length - 1])}` : ''}</span>
            <span style={{marginLeft: '1rem'}}>현재 랩: {formatTimeToString(stopwatch)}</span>
          </>
        ) : null}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/menu"><button className="btn-secondary">메인으로 돌아가기</button></Link>
      </div>
    </div>
  );
};

export default TimerPage;