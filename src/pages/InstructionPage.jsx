import React from 'react';
import { Link } from 'react-router-dom';

const InstructionPage = () => {
    return (
        <div className="page-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>사용 설명서</h2>
            
            <div className="manual-section" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <div className="setting-group">
                    <h3>수능 시뮬레이터</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>실제 수능 시간표에 맞춰 모의고사를 진행합니다.</li>
                        <li>'실제 수능 시간' 모드는 현재 시간 이후 가장 가까운 시험부터 시작합니다.</li>
                        <li>영어 듣기 파일을 첨부하면 3교시 시작 타종 없이 바로 듣기 평가가 시작됩니다.</li>
                    </ul>
                </div>
                <div className="setting-group">
                    <h3>맞춤 타이머</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>타이머가 멈춰있을 때 큰 숫자를 클릭하여 시간을 직접 수정할 수 있습니다.</li>
                        <li>타이머 작동 중에는 클릭 또는 스페이스바로 랩타임을 기록합니다.</li>
                        <li>종료 시 선택한 알림음이 재생되며, 기록된 랩타임은 보고서로 확인할 수 있습니다.</li>
                    </ul>
                </div>
                <div className="setting-group">
                    <h3>스톱워치</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>화면 클릭 또는 스페이스바로 시작/정지를 제어할 수 있습니다.</li>
                        <li>'랩' 버튼으로 구간 기록을 남길 수 있습니다.</li>
                    </ul>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/">
                    <button className="btn-primary">
                        처음으로 돌아가기
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default InstructionPage;