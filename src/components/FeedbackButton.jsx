import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext.jsx';

// styled-components를 사용하여 Link 태그에 직접 스타일을 적용합니다.
const StyledFeedbackLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 31px;
  height: 31px;
  font-size: 1.4rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  cursor: pointer;
  
  /* ## 여기가 핵심 수정 부분입니다 ## */
  border-radius: 50%; /* 원형 디자인으로 변경 */
  background: var(--color-bg); /* 배경색을 페이지 배경과 동일하게 설정 */
  transition: all 0.2s ease-in-out;

  /* 안쪽으로 그림자를 넣어 파묻힌 효과 생성 */
  box-shadow: inset 4px 4px 8px var(--btn-neumorphic-shadow-1),
              inset -4px -4px 8px var(--btn-neumorphic-shadow-2);

  &:hover {
    /* 호버 시 색상을 살짝 밝게/어둡게 하여 피드백 제공 */
    background: var(--color-card-bg);
  }

  &:active {
    /* 클릭 시 더 깊게 눌리는 효과 */
    transform: scale(0.95);
    box-shadow: inset 5px 5px 10px var(--btn-neumorphic-shadow-1),
                inset -5px -5px 10px var(--btn-neumorphic-shadow-2);
  }
`;

const FeedbackButton = () => {
    return (
        <StyledFeedbackLink to="/feedback" title="건의사항 보내기">
            ✉️
        </StyledFeedbackLink>
    );
};

export default FeedbackButton;