import React from 'react';
import { Link } from 'react-router-dom';
import ShootingStars from '../components/ShootingStars.jsx'; // 1. 별똥별 컴포넌트 import
import { useTheme } from '../context/ThemeContext.jsx';   // 2. useTheme 훅 import
import Sun from '../components/Sun.jsx';

const WelcomePage = () => {
    const { theme } = useTheme(); // 3. 현재 테마 상태를 가져옵니다.

    return (
        <div className="welcome-page-container">
            {/* 4. theme이 'dark'일 때 별똥별. theme이 'day'이면 Sun */}
            {theme === 'dark' && <ShootingStars />}
            {theme === 'light' && <Sun />}
            
            
            <div className="welcome-panel">
                <div className="welcome-content">
                    <h1 className="welcome-title">수능시계</h1>
                    <p className="welcome-subtitle">
                        수능시계에 오신 모든 수험생 여러분들 진심으로 환영합니다.
                    </p>
                </div>
                
                <div className="welcome-buttons">
                    <Link to="/menu" className="neumorphic-button">
                        메인 페이지로 이동
                    </Link>
                    {/* 아래 두 버튼을 새로운 div로 감쌉니다. */}
                    <div className="button-group">
                        <Link to="/instruction" className="neumorphic-button">
                            사용 설명서
                        </Link>
                        <Link to="/announcements" className="neumorphic-button">
                            공지사항
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;