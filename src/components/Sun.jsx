import React from 'react';

const Sun = () => {
    return (
        <div className="sun-fly-wrapper"> 
            <div className="sun">
                {/* 스스로 회전하는 sun-rotator 추가 */}
                <div className="sun-rotator">
                    <div className="center"></div>
                    <div className="ray r-1"></div>
                    <div className="ray r-2"></div>
                    <div className="ray r-3"></div>
                    <div className="ray r-4"></div>
                    <div className="ray r-5"></div>
                    <div className="ray r-6"></div>
                    <div className="ray r-7"></div>
                    <div className="ray r-8"></div>
                </div>
            </div>
        </div>
    );
};

export default Sun;