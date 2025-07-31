import React, { useState, createContext, useContext } from 'react';

// Context 생성
const EventContext = createContext();

// Context를 사용하기 위한 커스텀 훅
export const useEvent = () => useContext(EventContext);

// Context Provider 컴포넌트
export const EventProvider = ({ children }) => {
  const [isEventActive, setIsEventActive] = useState(false);

  // 이벤트 시작 함수
  const startEvent = () => setIsEventActive(true);
  
  // 이벤트 종료 함수
  const endEvent = () => setIsEventActive(false);
const value = { isEventActive, startEvent, endEvent }; // value에 endEvent 추가

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};