import React from 'react';
import { Link } from 'react-router-dom';

const SimulationLoader = ({ onStart, isStartEnabled }) => {
    return (
        <div className="loader-page-container">
            <h2>시뮬레이션 준비</h2>
            <div className="loader">
                <div className="truckWrapper">
                    <div className="truckBody">
                        <svg width="171" height="92" viewBox="0 0 198 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" fill="#F83D3D" stroke="#282828" strokeWidth="3"/>
                            <path d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" fill="#7D7C7C" stroke="#282828" strokeWidth="3"/>
                            <path d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" fill="#282828" stroke="#282828" strokeWidth="2"/>
                            <rect x="187" y="63" width="5" height="7" rx="1" fill="#FFFCAB" stroke="#282828" strokeWidth="2"/>
                            <rect x="193" y="81" width="4" height="11" rx="1" fill="#282828" stroke="#282828" strokeWidth="2"/>
                            <rect x="6.5" y="1.5" width="121" height="90" rx="2.5" fill="#DFDFDF" stroke="#282828" strokeWidth="3"/>
                            <rect x="1" y="84" width="6" height="4" rx="2" fill="#DFDFDF" stroke="#282828" strokeWidth="2"/>
                        </svg>
                    </div>
                    <div className="truckTires">
                        <svg width="26" height="26" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="13.5" fill="#282828" stroke="#282828" strokeWidth="3"/>
                            <circle cx="15" cy="15" r="7" fill="#DFDFDF"/>
                        </svg>
                        <svg width="26" height="26" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="13.5" fill="#282828" stroke="#282828" strokeWidth="3"/>
                            <circle cx="15" cy="15" r="7" fill="#DFDFDF"/>
                        </svg>
                    </div>
                    <div className="road"></div>
                </div>
            </div>
            <div className="loader-text">
                {isStartEnabled ? "준비가 완료되었습니다." : "10초 후 버튼이 활성화됩니다..."}
            </div>
            
            <div className="button-group loader-buttons">
                <Link to="/settings" className="neumorphic-button">
                    뒤로가기
                </Link>
                <button onClick={onStart} disabled={!isStartEnabled} className="neumorphic-button">
                    다음으로
                </button>
            </div>
        </div>
    );
};

export default SimulationLoader;