import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SCHEDULE_DATA } from '../data/schedule.js';

const SettingsPage = ({ onStart }) => {
  const [startMode, setStartMode] = useState('immediate');
  const [selectedSubjects, setSelectedSubjects] = useState({
    korean: true, math: true, english: true, history: true, inquiry1: true, inquiry2: false,
  });
  const [includeBreaks, setIncludeBreaks] = useState(true);
  const [includeBells, setIncludeBells] = useState(true);
  const [listeningFile, setListeningFile] = useState(null);

  const [fileName, setFileName] = useState('');

  // ## 1. 버튼 클릭 시 상태를 변경하는 핸들러 함수들 ##
  const handleSubjectToggle = (subjectKey) => {
    setSelectedSubjects(prev => ({ ...prev, [subjectKey]: !prev[subjectKey] }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setListeningFile(URL.createObjectURL(files[0]));
      setFileName(files[0].name);
    } else {
      setListeningFile(null);
    }
  };

  const handleStartClick = () => {
    onStart({ startMode, selectedSubjects, includeBreaks, includeBells, listeningFile });
  };

   const selectedSubjectNames = Object.keys(selectedSubjects)
    .filter(key => selectedSubjects[key] && SCHEDULE_DATA[key])
    .map(key => SCHEDULE_DATA[key].name.split(" ")[1])
    .join(' | ');

  return (
    <div className="settings-page-container">
      <div className="settings-panel">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>수능 시뮬레이터 설정</h2>
        
        <div className="setting-group">
          <h3>시작 방식</h3>
          {/* ## 여기가 핵심 수정 부분입니다 ## */}
          <div className="button-group">
            <button
              onClick={() => setStartMode('immediate')}
              className={`mode-button ${startMode === 'immediate' ? 'is-active' : ''}`}
            >
              즉시 시작
            </button>
            <button
              onClick={() => setStartMode('real-time')}
              className={`mode-button ${startMode === 'real-time' ? 'is-active' : ''}`}
            >
              실제 수능 시간
            </button>
          </div>
        </div>


        <div className="setting-group">
          {/* ## 2. 제목(h3) 부분에 계산된 과목 목록 표시 ## */}
          <h3>
            응시 영역
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginLeft: '10px', fontWeight: 'normal' }}>
              ({selectedSubjectNames})
            </span>
          </h3>
          <div className="subject-grid">
            {Object.keys(SCHEDULE_DATA).filter(key => SCHEDULE_DATA[key].isExam).map(key => (
              <button 
                key={key}
                onClick={() => handleSubjectToggle(key)}
                className={`subject-toggle-button ${selectedSubjects[key] ? 'is-active' : ''}`}
              >
                {SCHEDULE_DATA[key].name.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>추가 시간</h3>
          {/* ## className을 "subject-grid"로 변경합니다. ## */}
          <div className="subject-grid">
              <button onClick={() => setIncludeBreaks(prev => !prev)} className={`subject-toggle-button ${includeBreaks ? 'is-active' : ''}`}>
                  쉬는 시간 포함
              </button>
              <button onClick={() => setIncludeBells(prev => !prev)} className={`subject-toggle-button ${includeBells ? 'is-active' : ''}`}>
                  예비령/준비령 포함
              </button>
          </div>
        </div>
  {selectedSubjects.english && (
          <div className="setting-group">
            <h3>영어 듣기 평가 파일 (선택)</h3>
            <p style={{fontSize: '0.8rem', margin: '0 0 8px 0', color: 'var(--color-text-secondary)'}}>파일 첨부 시 3교시 시작 타종 없이 듣기 평가가 바로 시작됩니다.</p>
            
            <div className="file-upload-wrapper">
                <label htmlFor="listening-file" className="file-upload-button">파일 찾기</label>
                <input id="listening-file" type="file" accept="audio/mp3" name="listeningFile" onChange={handleFileChange} />
                <span className="file-name">{fileName || "선택된 파일 없음"}</span>
            </div>
          </div>
        )}
        
<div className="setting-group">
         <div className="button-group">
            <Link to="/menu" className="neumorphic-button">
              뒤로가기
            </Link>
            <button onClick={handleStartClick} className="neumorphic-button">시뮬레이션 시작</button>
          </div>
       </div>
      </div>
    </div>
  );
};

export default SettingsPage;