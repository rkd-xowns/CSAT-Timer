// export const SCHEDULE_DATA = {
//     // 1교시 (짧게 유지)
//     korean_preliminary: { name: "1교시 예비령", duration: 15, isExam: false, type: 'bell', startTime: "08:25:00" },
//     korean_prepare: { name: "1교시 준비령", duration: 15, isExam: false, type: 'prepare', startTime: "08:35:00" },
//     korean: { name: "1교시 국어", duration: 60, isExam: true, type: 'exam', startTime: "08:40:00" },
//     break1: { name: "쉬는 시간", duration: 15, isExam: false, type: 'break', startTime: "10:00:00" },
//     // 2교시 (짧게 유지)
//     math_preliminary: { name: "2교시 예비령", duration: 15, isExam: false, type: 'bell', startTime: "10:20:00" },
//     math_prepare: { name: "2교시 준비령", duration: 15, isExam: false, type: 'prepare', startTime: "10:25:00" },
//     math: { name: "2교시 수학", duration: 60, isExam: true, type: 'exam', startTime: "10:30:00" },
//     lunch: { name: "점심 시간", duration: 15, isExam: false, type: 'break', startTime: "12:10:00" },
    
//     // 3교시: 듣기 평가 테스트를 위해 시간 조정
//     english_preliminary: { name: "3교시 예비령", duration: 15, isExam: false, type: 'bell', startTime: "13:00:00" },
//     // 준비령 시간을 3분 5초(185초)로 설정
//     english_prepare: { name: "3교시 준비령", duration: 185, isExam: false, type: 'prepare', startTime: "13:05:00" }, 
//     english: { name: "3교시 영어", duration: 60, isExam: true, type: 'exam', startTime: "13:10:00" },
    
//     // 4교시 (짧게 유지)
//     break2: { name: "쉬는 시간", duration: 15, isExam: false, type: 'break', startTime: "14:20:00" },
//     history_preliminary: { name: "4교시 예비령", duration: 15, isExam: false, type: 'bell', startTime: "14:45:00" },
//     history_prepare: { name: "4교시 준비령", duration: 15, isExam: false, type: 'prepare', startTime: "14:55:00" },
//     history: { name: "4교시 한국사", duration: 60, isExam: true, type: 'exam', startTime: "15:00:00" },
//     collect1: { name: "한국사 시험지 회수", duration: 15, isExam: false, type: 'admin', startTime: "15:30:00" },
    // inquiry1: { name: "4교시 탐구1", duration: 60, isExam: true, type: 'exam', startTime: "15:45:00" },
    // collect2: { name: "탐구1 시험지 회수", duration: 15, isExam: false, type: 'admin', startTime: "16:15:00" },
    // inquiry2: { name: "4교시 탐구2", duration: 60, isExam: true, type: 'exam', startTime: "16:17:00" },
// };

export const SCHEDULE_DATA = {
    // 1교시 국어
    korean_preliminary: { name: "1교시 예비령", duration: 10 * 60, isExam: false, type: 'bell', startTime: "08:25:00" },
    korean_prepare: { name: "1교시 준비령", duration: 5 * 60, isExam: false, type: 'prepare', startTime: "08:35:00" },
    korean: { name: "1교시 국어", duration: 80 * 60, isExam: true, type: 'exam', startTime: "08:40:00" },
    break1: { name: "쉬는 시간", duration: 20 * 60, isExam: false, type: 'break', startTime: "10:00:00" },
    
    // 2교시 수학
    math_preliminary: { name: "2교시 예비령", duration: 5 * 60, isExam: false, type: 'bell', startTime: "10:20:00" },
    math_prepare: { name: "2교시 준비령", duration: 5 * 60, isExam: false, type: 'prepare', startTime: "10:25:00" },
    math: { name: "2교시 수학", duration: 100 * 60, isExam: true, type: 'exam', startTime: "10:30:00" },
    lunch: { name: "점심 시간", duration: 50 * 60, isExam: false, type: 'break', startTime: "12:10:00" },
    
    // 3교시 영어
    english_preliminary: { name: "3교시 예비령", duration: 5 * 60, isExam: false, type: 'bell', startTime: "13:00:00" },
    english_prepare: { name: "3교시 준비령", duration: 5 * 60, isExam: false, type: 'prepare', startTime: "13:05:00" },
    english: { name: "3교시 영어", duration: 70 * 60, isExam: true, type: 'exam', startTime: "13:10:00" },
    break2: { name: "쉬는 시간", duration: 20 * 60, isExam: false, type: 'break', startTime: "14:20:00" },

    // 4교시 한국사 / 탐구
    history_preliminary: { name: "4교시 예비령", duration: 5 * 60, isExam: false, type: 'bell', startTime: "14:40:00" },
    history_prepare: { name: "4교시 준비령", duration: 5 * 60, isExam: false, type: 'prepare', startTime: "14:45:00" },
    history: { name: "4교시 한국사", duration: 30 * 60, isExam: true, type: 'exam', startTime: "14:50:00" },
    collect1: { name: "한국사 문제지 회수", duration: 5 * 60, isExam: false, type: 'admin', startTime: "15:20:00" },

    // ## 1. 탐구 예비령/준비령 추가 ##
//     inquiry1_preliminary: { name: "탐구 예비령", duration: 5 * 60, isExam: false, type: 'bell', startTime: "15:25:00" },
//     inquiry1_prepare: { name: "탐구 준비령", duration: 5 * 60, isExam: false, type: 'prepare', startTime: "15:30:00" }, // 준비령은 본령과 동시에 시작
//     inquiry1: { name: "4교시 탐구 (첫번째)", duration: 30 * 60, isExam: true, type: 'exam', startTime: "15:35:00" },
//     collect2: { name: "탐구 문제지 회수/배부", duration: 2 * 60, isExam: false, type: 'admin', startTime: "16:05:00" },
//     inquiry2: { name: "4교시 탐구 (두번째)", duration: 30 * 60, isExam: true, type: 'exam', startTime: "16:07:00" },


    inquiry1_preliminary: { name: "탐구 예비령", duration: 60, isExam: false, type: 'bell', startTime: "12:32:00" },
    inquiry1_prepare: { name: "탐구 준비령", duration: 60, isExam: false, type: 'prepare', startTime: "12:33:00" },
    inquiry1: { name: "4교시 탐구1", duration: 60, isExam: true, type: 'exam', startTime: "12:34:00" },
    collect2: { name: "탐구1 시험지 회수", duration: 60, isExam: false, type: 'admin', startTime: "12:35:00" },
    inquiry2: { name: "4교시 탐구2", duration: 60, isExam: true, type: 'exam', startTime: "12:36:00" },

};




export const buildTestQueue = (settings) => {
    const { selectedSubjects, includeBreaks, includeBells } = settings;
    const queue = [];
    const addBlock = (key) => {
        if(SCHEDULE_DATA[key]) {
            queue.push({ key, ...SCHEDULE_DATA[key] });
        }
    };
    
    const subjectOrder = ['korean', 'math', 'english', 'history', 'inquiry1', 'inquiry2'];
    
    subjectOrder.forEach((subjectKey, index) => {
        if (selectedSubjects[subjectKey]) {
            if (includeBells) {
                if (SCHEDULE_DATA[`${subjectKey}_preliminary`]) addBlock(`${subjectKey}_preliminary`);
                if (SCHEDULE_DATA[`${subjectKey}_prepare`]) addBlock(`${subjectKey}_prepare`);
            }
            addBlock(subjectKey);
            if (includeBreaks) {
                const nextSubjectKey = subjectOrder[index + 1];
                if (nextSubjectKey && selectedSubjects[nextSubjectKey]) {
                    if (subjectKey === 'korean') addBlock('break1');
                    if (subjectKey === 'math') addBlock('lunch');
                    if (subjectKey === 'english') addBlock('break2');
                    if (subjectKey === 'history') addBlock('collect1');
                    if (subjectKey === 'inquiry1') addBlock('collect2');
                }
            }
        }
    });
    
    return queue;
};