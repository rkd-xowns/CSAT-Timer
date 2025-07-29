import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const getCsatDday = () => {
    const csatDate = new Date('2025-11-20T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = csatDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const ReportPage = ({ lapData, status }) => {
  const reportRef = useRef();
  const [today, setToday] = useState('');
  const [dDay, setDDay] = useState(0);

  // ## 1. 편집 가능한 상태 관리 ##
  const [reportTitle, setReportTitle] = useState('');
  const [lapDetails, setLapDetails] = useState({});
  const [showVirtualTime, setShowVirtualTime] = useState(true);

  useEffect(() => {
    setToday(new Date().toLocaleDateString('ko-KR'));
    setDDay(getCsatDday());

    // lapData가 변경될 때, 편집 가능한 내부 상태(lapDetails)를 초기화합니다.
    if (lapData) {
      const initialDetails = {};
      Object.keys(lapData).forEach(subjectName => {
        initialDetails[subjectName] = lapData[subjectName].map(lap => ({
          ...lap,
          description: '', // 활동 내용을 위한 빈 문자열 추가
        }));
      });
      setLapDetails(initialDetails);
    }
  }, [lapData]);

  // 활동 내용 수정 핸들러
  const handleDescriptionChange = (subjectName, lapIndex, newDescription) => {
    setLapDetails(prev => ({
      ...prev,
      [subjectName]: prev[subjectName].map((lap, index) => 
        index === lapIndex ? { ...lap, description: newDescription } : lap
      )
    }));
  };

  const handleExportPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: '수능시계_결과보고서.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const subjects = Object.keys(lapData || {}).join(', ');

  return (
    <div className="report-page-container">
      <div className="report-sheet" ref={reportRef}>
        <h1 className="report-main-title">결과 보고서</h1>
        {status === 'aborted' && (
            <h3 style={{textAlign: 'center', color: 'red', marginTop: '-1rem', marginBottom: '1rem'}}>-- 중단됨 --</h3>
        )}
        
        <div className="report-meta-grid">
          <div className="meta-item"><strong>수능 D-DAY</strong><span>D-{dDay}</span></div>
          <div className="meta-item"><strong>날짜</strong><span>{today}</span></div>
          <div className="meta-item">
            <strong>제목 설정</strong>
            <input 
              type="text" 
              value={reportTitle} 
              onChange={e => setReportTitle(e.target.value)} 
              placeholder="(클릭하여 입력)"
            />
          </div>
        </div>

        <div className="report-subjects">
            <strong>실시 항목:</strong> {subjects}
        </div>

        {Object.entries(lapDetails).map(([subjectName, laps]) => (
            <div key={subjectName} className="subject-report-block">
                <h3>{subjectName}</h3>
                <div className="lap-record-table">
                    <div className="lap-record-header">
                        <span style={{ flex: 3 }}>활동 내용 (클릭하여 입력)</span>
                        <span style={{ flex: 1 }}>소요 시간</span>
                        {showVirtualTime && <span style={{ flex: 1 }}>실제 수능 시간</span>}
                    </div>
                    {laps.map((lapInfo, index) => (
                        <div key={index} className="lap-record-row">
                            <input 
                              type="text"
                              value={lapInfo.description}
                              onChange={e => handleDescriptionChange(subjectName, index, e.target.value)}
                              placeholder="..."
                              style={{ flex: 3 }}
                            />
                            <span style={{ flex: 1 }}>{formatTime(lapInfo.lap)}</span>
                            {showVirtualTime && <span style={{ flex: 1 }}>{lapInfo.time}</span>}
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="report-controls">
        <div className="toggle-setting">
            <label>실제 수능 시간 표시</label>
            <input type="checkbox" checked={showVirtualTime} onChange={() => setShowVirtualTime(p => !p)} />
        </div>
        <div className="button-group">
            <button onClick={handleExportPDF}>PDF로 저장</button>
            <Link to="/menu"><button className="btn-secondary">메인 메뉴로</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;