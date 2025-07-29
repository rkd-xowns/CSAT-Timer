import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const getCsatDday = () => {
    const csatDate = new Date('2025-11-13T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    const diff = csatDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const MenuPage = () => {
    const [dDay, setDDay] = useState(0);
    useEffect(() => { setDDay(getCsatDday()); }, []);

    return (
        <div className="main-page-container">
            {/* D-Day가 포함된 hero-section을 다시 확인합니다. */}
            <div className="hero-section">
                <h1 className="hero-title">수능시계</h1>
                <p className="hero-subtitle">수능까지 남은 시간</p>
                <div className="d-day-display">D-{dDay}</div>
            </div>
            <div className="feature-grid">
                <Link to="/settings" className="menu-button">
                    <div className="button-outer">
                        <div className="button-inner">
                            <span className="card-icon">⏱️</span>
                            <div className="text">
                                <h3 className="card-title">수능 시뮬레이터</h3>
                                <p className="card-description">실제 시험처럼 시간을 관리하며 모의고사를 진행합니다.</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to="/timer" className="menu-button">
                     <div className="button-outer">
                        <div className="button-inner">
                            <span className="card-icon">⏲️</span>
                            <div className="text">
                                <h3 className="card-title">맞춤 타이머(BETA)</h3>
                                <p className="card-description">원하는 시간을 설정하고 집중력을 높여보세요.</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to="/stopwatch" className="menu-button">
                     <div className="button-outer">
                        <div className="button-inner">
                            <span className="card-icon">⏳</span>
                            <div className="text">
                                <h3 className="card-title">스톱워치(BETA)</h3>
                                <p className="card-description">과목별, 문제별 풀이 시간을 정확하게 측정합니다.</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to="/feedback" className="menu-button">
                     <div className="button-outer">
                        <div className="button-inner">
                            <span className="card-icon">✉️</span>
                            <div className="text">
                                <h3 className="card-title">건의사항</h3>
                                <p className="card-description">더 좋은 서비스를 위해 의견을 보내주세요.</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MenuPage;