import React from 'react';
import { Link } from 'react-router-dom';

const FeedbackPage = () => {
  return (
    <div className="page-container">
      <h2 style={{ textAlign: 'center' }}>문의하기</h2>
      <form action="https://formspree.io/f/movljwzk" method="POST">
        <div className="setting-group">
          <h3>문의 유형</h3>
          <label><input type="radio" name="문의 유형" value="건의사항" defaultChecked /> 건의사항</label>
          <label><input type="radio" name="문의 유형" value="광고문의" /> 광고문의</label>
          <label><input type="radio" name="문의 유형" value="기타사항" /> 기타사항</label>
        </div>
        <div className="setting-group">
          <h3>내용</h3>
          <textarea 
            style={{ width: '95%', minHeight: '150px', padding: '10px', fontSize: '1rem' }}
            name="내용"
            placeholder="소중한 의견을 남겨주세요."
            required 
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button type="submit">제출하기</button>
          <Link to="/menu"><button className="btn-secondary">메인으로 돌아가기</button></Link>
        </div>
      </form>
    </div>
  );
};
export default FeedbackPage;