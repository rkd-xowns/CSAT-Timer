import React from 'react';
import { Link } from 'react-router-dom';

const AnnouncementsPage = () => {
    return (
        <div className="page-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>공지사항</h2>
            
            <div style={{ textAlign: 'center', color: '#888' }}>
                <p>현재 등록된 공지사항이 없습니다.</p>
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

export default AnnouncementsPage;