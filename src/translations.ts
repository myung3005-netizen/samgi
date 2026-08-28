export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  langKo: string;
  langVi: string;
  teacherEntry: string;
  teacherMode: string;
  exitTeacherMode: string;
  roomCode: string;
  displayName: string;
  joinRoom: string;
  joining: string;
  enterRoomCodePlaceholder: string;
  enterDisplayNamePlaceholder: string;
  prev: string;
  next: string;
  cancel: string;
  submit: string;
  confirm: string;
  complete: string;
  statusPlanning: string;
  statusRevising: string;
  statusCompleted: string;

  // Questionnaire
  questionTitle: string;
  stepIndicator: string;
  qDestination: string;
  qDestinationSub: string;
  qPurpose: string;
  qPurposeSub: string;
  qCompanion: string;
  qCompanionSub: string;
  qDuration: string;
  qDurationSub: string;
  qBudget: string;
  qBudgetSub: string;
  qMustDo: string;
  qMustDoSub: string;
  qMustDoPlaceholder: string;
  qMustHave: string;
  qMustHaveSub: string;
  qMustHavePlaceholder: string;
  qReason: string;
  qReasonSub: string;
  qReasonPlaceholder: string;
  customInputOption: string;
  customInputPlaceholder: string;

  // Summary
  summaryTitle: string;
  summarySubtitle: string;
  summaryDestination: string;
  summaryPurpose: string;
  summaryCompanion: string;
  summaryDuration: string;
  summaryBudget: string;
  summaryMustDo: string;
  summaryMustHave: string;
  summaryReason: string;
  generateScriptBtn: string;
  generatingScript: string;
  generatingScriptDesc: string;

  // Script Revision Screen
  scriptEditorTitle: string;
  scriptEditorInstruction: string;
  sentenceClickHint: string;
  selectedSentenceLabel: string;
  revisionModalTitle: string;
  revisionModalPrompt: string;
  revisionModalPlaceholder: string;
  revisionSuggestionsLabel: string;
  suggestion1: string;
  suggestion2: string;
  suggestion3: string;
  suggestion4: string;
  suggestion5: string;
  revisingBtn: string;
  revisingSentence: string;
  revisionCountBadge: string;
  finalizeScriptBtn: string;
  finalizeConfirmTitle: string;
  finalizeConfirmMessage: string;
  continueRevisingBtn: string;
  confirmFinalizeBtn: string;

  // Waiting / Presenter Screen
  presenterTitle: string;
  presenterSubtitle: string;
  practiceSpeakingTip: string;
  waitingForCardsTitle: string;
  waitingForCardsDesc: string;
  refreshStatus: string;

  // Voting Screen
  votingTitle: string;
  votingSubtitle: string;
  myTripBadge: string;
  myTripDesc: string;
  voteBtn: string;
  voteConfirmTitle: string;
  voteConfirmMessage: string;
  voteSuccessTitle: string;
  voteSuccessMessage: string;
  votingClosedNotice: string;
  alreadyVotedNotice: string;

  leaveRoom: string;
  leaveRoomConfirm: string;
  rejoinedWelcome: string;
  classroomsList: string;
  selectClassroom: string;
  deleteClassroom: string;
  deleteConfirm: string;
  customRoomCodeLabel: string;
  customRoomCodePlaceholder: string;
  roomTitleLabel: string;
  roomTitlePlaceholder: string;
  codeAlreadyExists: string;
  noClassroomsYet: string;
  switchClassroom: string;

  // Teacher Screen
  teacherLoginTitle: string;
  teacherPasswordLabel: string;
  teacherPasswordPlaceholder: string;
  loginBtn: string;
  createNewRoomBtn: string;
  creatingRoom: string;
  activeClassroom: string;
  classRoomCodeLabel: string;
  participantsCount: string;
  tableColStudent: string;
  tableColDestination: string;
  tableColStatus: string;
  tableColRevisions: string;
  tableColActions: string;
  viewStudentWork: string;
  noParticipantsYet: string;
  revealCardsBtn: string;
  cardsRevealedNotice: string;
  closeVotingBtn: string;
  votingClosedState: string;
  viewResultsBtn: string;
  votingResultsTitle: string;
  votingResultsDesc: string;
  rankLabel: string;
  votesCountLabel: string;
  listeningQuizTitle: string;
  listeningQuizDesc: string;
  questionLabel: string;
  answerLabel: string;
  revisionHistoryTitle: string;
  revisionNumberLabel: string;
  originalTextLabel: string;
  studentRequestLabel: string;
  revisedTextLabel: string;
  closeModal: string;

  // Errors
  errorRoomNotFound: string;
  errorNameRequired: string;
  errorDuplicateName: string;
  errorGeneric: string;
  errorInvalidPassword: string;
  errorCannotVoteSelf: string;
  errorAlreadyVoted: string;
  errorVotingClosed: string;
}

export const translations: Record<'ko' | 'vi', Translations> = {
  ko: {
    appName: "나의 꿈의 여행",
    appSubtitle: "My Dream Trip",
    tagline: "나만의 여행을 기획하고, 멋진 발표문을 완성해 보세요!",
    langKo: "한국어",
    langVi: "Tiếng Việt",
    teacherEntry: "선생님 전용",
    teacherMode: "선생님 모드",
    exitTeacherMode: "학생 화면으로",
    roomCode: "수업 코드",
    displayName: "이름 또는 별명",
    joinRoom: "수업 참여하기",
    joining: "참여하는 중...",
    enterRoomCodePlaceholder: "예: 1반, 301, TRIP",
    enterDisplayNamePlaceholder: "예: 민수, 지민, 란...",
    prev: "이전",
    next: "다음",
    cancel: "취소",
    submit: "완료",
    confirm: "확인",
    complete: "완료하기",
    statusPlanning: "여행 만들기",
    statusRevising: "발표문 수정 중",
    statusCompleted: "완료",
    leaveRoom: "수업 나가기",
    leaveRoomConfirm: "현재 수업에서 나가 처음 화면으로 돌아가시겠습니까?",
    rejoinedWelcome: "이전에 작성하던 여행 계획을 불러왔습니다!",
    classroomsList: "수업 목록 및 기록",
    selectClassroom: "수업 선택",
    deleteClassroom: "수업 삭제",
    deleteConfirm: "이 수업과 학생들의 모든 참여 기록을 삭제하시겠습니까?",
    customRoomCodeLabel: "수업 코드 (직접 입력 또는 자동 생성)",
    customRoomCodePlaceholder: "예: 1반, 301, TRIP (비워두면 자동 생성)",
    roomTitleLabel: "수업 제목",
    roomTitlePlaceholder: "예: 5학년 2반 꿈의 여행 발표",
    codeAlreadyExists: "이미 존재하는 수업 코드입니다. 다른 코드를 입력해 주세요.",
    noClassroomsYet: "생성된 수업이 없습니다. '새 수업 만들기' 버튼을 눌러 수업을 시작해 보세요.",
    switchClassroom: "수업 전환",

    // Questionnaire
    questionTitle: "나의 여행 만들기",
    stepIndicator: "단계",
    qDestination: "어디로 떠나고 싶나요?",
    qDestinationSub: "가장 가보고 싶은 여행지를 선택해 주세요.",
    qPurpose: "여행의 가장 큰 목적이나 테마는 무엇인가요?",
    qPurposeSub: "어떤 여행을 즐기고 싶나요?",
    qCompanion: "누구와 함께 가고 싶나요?",
    qCompanionSub: "동행할 사람을 골라보세요.",
    qDuration: "여행 기간은 얼마나 생각하나요?",
    qDurationSub: "일정을 선택해 주세요.",
    qBudget: "예산은 어느 정도가 좋을까요?",
    qBudgetSub: "원하는 예상 경비를 골라보세요.",
    qMustDo: "이 여행에서 딱 하나 꼭 하고 싶은 것은?",
    qMustDoSub: "가장 기대되는 활동을 짧게 적어보세요.",
    qMustDoPlaceholder: "예: 타코야키 배부르게 먹기, 디즈니랜드 놀이기구 타기...",
    qMustHave: "이 여행에서 꼭 필요한 것은 무엇인가요?",
    qMustHaveSub: "필수 준비물을 적어보세요.",
    qMustHavePlaceholder: "예: 편한 운동화, 스마트폰 카메라, 보조배터리...",
    qReason: "왜 이 여행을 가고 싶은가요?",
    qReasonSub: "여행을 떠나고 싶은 이유나 마음을 적어보세요.",
    qReasonPlaceholder: "예: 친구와 특별한 추억을 만들고 신나게 놀고 싶어서...",
    customInputOption: "직접 입력하기",
    customInputPlaceholder: "직접 입력해 주세요...",

    // Summary
    summaryTitle: "내가 만든 여행 계획",
    summarySubtitle: "선택한 내용을 확인하고 AI 발표문을 생성해 보세요.",
    summaryDestination: "여행지",
    summaryPurpose: "목적/테마",
    summaryCompanion: "함께 갈 사람",
    summaryDuration: "여행 기간",
    summaryBudget: "예산",
    summaryMustDo: "꼭 하고 싶은 것",
    summaryMustHave: "꼭 필요한 것",
    summaryReason: "여행 이유",
    generateScriptBtn: "여행 발표문 만들기",
    generatingScript: "발표문 생성 중...",
    generatingScriptDesc: "내가 입력한 여행 계획을 바탕으로 맞춤형 한국어 발표문을 작성하고 있습니다.",

    // Script Revision
    scriptEditorTitle: "발표문 다듬기",
    scriptEditorInstruction: "발표문을 읽어 보세요. 바꾸고 싶은 문장이 있다면 그 문장을 눌러 주세요.",
    sentenceClickHint: "문장을 누르면 원하는 방식으로 고칠 수 있어요!",
    selectedSentenceLabel: "선택한 문장",
    revisionModalTitle: "문장 수정하기",
    revisionModalPrompt: "이 문장을 어떻게 바꿀까요?",
    revisionModalPlaceholder: "예: 친구와 간다는 내용을 더 강조해줘, 좀 더 쉽게 바꿔줘, 더 생생하게 표현해줘...",
    revisionSuggestionsLabel: "💡 이런 요청을 해볼 수 있어요:",
    suggestion1: "친구와 간다는 내용을 더 강조해줘.",
    suggestion2: "좀 더 재미있고 생생하게 바꿔줘.",
    suggestion3: "너무 어려운 말인 것 같아. 쉽게 바꿔줘.",
    suggestion4: "더 짧고 간결하게 줄여줘.",
    suggestion5: "내가 직접 친구들에게 말하듯이 바꿔줘.",
    revisingBtn: "수정하기",
    revisingSentence: "AI가 문장을 고치는 중...",
    revisionCountBadge: "수정 횟수",
    finalizeScriptBtn: "발표문 완성하기",
    finalizeConfirmTitle: "발표문을 최종본으로 저장할까요?",
    finalizeConfirmMessage: "완성하면 친구들에게 발표할 최종 발표문으로 저장됩니다.",
    continueRevisingBtn: "계속 수정하기",
    confirmFinalizeBtn: "최종본으로 저장하기",

    // Waiting / Presenter
    presenterTitle: "나의 최종 발표문",
    presenterSubtitle: "교실에서 발표할 때 이 화면을 보며 또박또박 발표해 보세요.",
    practiceSpeakingTip: "🗣️ 큰 목소리로 1분 동안 읽어보며 발표 연습을 해보세요!",
    waitingForCardsTitle: "선생님의 여행 카드 공개를 기다리는 중...",
    waitingForCardsDesc: "친구들의 발표가 모두 끝나면 여행 카드가 공개되고 투표가 시작됩니다.",
    refreshStatus: "새로고침",

    // Voting
    votingTitle: "친구들의 여행을 구경해 보세요!",
    votingSubtitle: "가장 함께 가고 싶은 친구의 여행 카드에 투표해 보세요. (1인 1표)",
    myTripBadge: "내 여행",
    myTripDesc: "자신의 여행에는 투표할 수 없습니다.",
    voteBtn: "이 여행에 참여하고 싶어요",
    voteConfirmTitle: "이 여행에 투표하시겠습니까?",
    voteConfirmMessage: "한 번 투표하면 다시 변경할 수 없습니다. 이 여행을 선택할까요?",
    voteSuccessTitle: "투표가 완료되었습니다!",
    voteSuccessMessage: "선생님이 결과를 발표할 때까지 기다려 주세요.",
    votingClosedNotice: "투표가 종료되었습니다. 선생님의 결과 발표를 기대해 주세요!",
    alreadyVotedNotice: "이미 투표를 마쳤습니다. 결과를 기다려 주세요.",

    // Teacher
    teacherLoginTitle: "선생님 로그인",
    teacherPasswordLabel: "선생님 비밀번호",
    teacherPasswordPlaceholder: "비밀번호 4자리를 입력하세요",
    loginBtn: "로그인",
    createNewRoomBtn: "새 수업 만들기",
    creatingRoom: "새 수업 생성 중...",
    activeClassroom: "현재 수업",
    classRoomCodeLabel: "수업 코드",
    participantsCount: "참여 학생",
    tableColStudent: "학생",
    tableColDestination: "여행지",
    tableColStatus: "진행 상태",
    tableColRevisions: "수정 횟수",
    tableColActions: "상세 보기",
    viewStudentWork: "발표문 & 퀴즈 보기",
    noParticipantsYet: "아직 참여한 학생이 없습니다. 학생들에게 수업 코드를 안내해 주세요.",
    revealCardsBtn: "여행 카드 공개",
    cardsRevealedNotice: "여행 카드가 공개되었습니다. 학생들이 투표할 수 있습니다.",
    closeVotingBtn: "투표 종료",
    votingClosedState: "투표가 마감되었습니다.",
    viewResultsBtn: "투표 결과 보기",
    votingResultsTitle: "여행 투표 결과",
    votingResultsDesc: "학생들이 가장 참여하고 싶어하는 여행 순위입니다.",
    rankLabel: "위",
    votesCountLabel: "표",
    listeningQuizTitle: "발표 듣기 퀴즈 (골든벨용)",
    listeningQuizDesc: "학생의 최종 발표문을 바탕으로 자동 생성된 듣기 평가 문제입니다.",
    questionLabel: "질문",
    answerLabel: "정답",
    revisionHistoryTitle: "문장 수정 이력",
    revisionNumberLabel: "회차",
    originalTextLabel: "수정 전",
    studentRequestLabel: "학생 요청",
    revisedTextLabel: "수정 후",
    closeModal: "닫기",

    // Errors
    errorRoomNotFound: "수업 코드를 찾을 수 없습니다. 다시 확인해 주세요.",
    errorNameRequired: "이름 또는 별명을 입력해 주세요.",
    errorDuplicateName: "이미 참여 중인 이름입니다. 다른 이름이나 번호를 덧붙여 주세요.",
    errorGeneric: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    errorInvalidPassword: "비밀번호가 올바르지 않습니다.",
    errorCannotVoteSelf: "자신의 여행에는 투표할 수 없습니다.",
    errorAlreadyVoted: "이미 투표하셨습니다.",
    errorVotingClosed: "투표가 마감되었습니다.",
  },
  vi: {
    appName: "Chuyến Đi Mơ Ước",
    appSubtitle: "My Dream Trip",
    tagline: "Hãy tự lên kế hoạch cho chuyến đi và hoàn thành bài thuyết trình thật ấn tượng!",
    langKo: "한국어",
    langVi: "Tiếng Việt",
    teacherEntry: "Dành Cho Giáo Viên",
    teacherMode: "Chế độ Giáo viên",
    exitTeacherMode: "Về màn hình Học sinh",
    roomCode: "Mã phòng học",
    displayName: "Tên hoặc Biệt danh",
    joinRoom: "Tham gia lớp học",
    joining: "Đang tham gia...",
    enterRoomCodePlaceholder: "VD: 101, TRIP...",
    enterDisplayNamePlaceholder: "VD: Min-soo, Lan, Nam...",
    prev: "Trước",
    next: "Tiếp theo",
    cancel: "Hủy",
    submit: "Hoàn thành",
    confirm: "Xác nhận",
    complete: "Hoàn tất",
    statusPlanning: "Lập kế hoạch",
    statusRevising: "Đang sửa bài",
    statusCompleted: "Đã hoàn thành",
    leaveRoom: "Rời phòng học",
    leaveRoomConfirm: "Bạn có muốn rời khỏi phòng học hiện tại và quay về màn hình đầu tiên?",
    rejoinedWelcome: "Đã khôi phục kế hoạch du lịch bạn đã làm trước đó!",
    classroomsList: "Danh sách lớp học",
    selectClassroom: "Chọn lớp học",
    deleteClassroom: "Xóa lớp học",
    deleteConfirm: "Bạn có chắc chắn muốn xóa lớp học này cùng toàn bộ bài làm của học sinh?",
    customRoomCodeLabel: "Mã phòng học (Tự nhập hoặc tạo tự động)",
    customRoomCodePlaceholder: "VD: 101, TRIP (Để trống để tạo tự động)",
    roomTitleLabel: "Tiêu đề lớp học",
    roomTitlePlaceholder: "VD: Lớp 5A Thuyết trình du lịch",
    codeAlreadyExists: "Mã phòng học này đã tồn tại. Vui lòng nhập mã khác.",
    noClassroomsYet: "Chưa có lớp học nào được tạo. Hãy bấm 'Tạo Lớp Học Mới' để bắt đầu.",
    switchClassroom: "Chuyển lớp học",

    // Questionnaire
    questionTitle: "Tạo Chuyến Đi Của Tôi",
    stepIndicator: "Bước",
    qDestination: "Bạn muốn đi du lịch ở đâu?",
    qDestinationSub: "Hãy chọn điểm đến bạn muốn đến nhất.",
    qPurpose: "Mục đích hoặc chủ đề chính của chuyến đi là gì?",
    qPurposeSub: "Bạn muốn tận hưởng chuyến đi như thế nào?",
    qCompanion: "Bạn muốn đi cùng ai?",
    qCompanionSub: "Hãy chọn người đồng hành cùng bạn.",
    qDuration: "Thời gian chuyến đi là bao lâu?",
    qDurationSub: "Hãy chọn lịch trình phù hợp.",
    qBudget: "Ngân sách dự kiến khoảng bao nhiêu?",
    qBudgetSub: "Chọn mức chi phí mong muốn.",
    qMustDo: "Điều bạn nhất định phải làm trong chuyến đi này là gì?",
    qMustDoSub: "Hãy viết ngắn gọn hoạt động bạn mong đợi nhất.",
    qMustDoPlaceholder: "VD: Ăn no nê bánh Takoyaki, chơi tàu lượn ở Disneyland...",
    qMustHave: "Vật dụng không thể thiếu trong chuyến đi này là gì?",
    qMustHaveSub: "Hãy viết vật dụng cần chuẩn bị.",
    qMustHavePlaceholder: "VD: Giày thể thao êm chân, máy ảnh điện thoại, sạc dự phòng...",
    qReason: "Tại sao bạn muốn đi chuyến du lịch này?",
    qReasonSub: "Hãy chia sẻ lý do hoặc cảm xúc của bạn.",
    qReasonPlaceholder: "VD: Muốn tạo kỷ niệm đẹp với bạn bè và chơi thật vui...",
    customInputOption: "Nhập trực tiếp",
    customInputPlaceholder: "Vui lòng nhập tại đây...",

    // Summary
    summaryTitle: "Kế Hoạch Chuyến Đi Của Tôi",
    summarySubtitle: "Kiểm tra lại nội dung đã chọn và tạo bài thuyết trình bằng AI.",
    summaryDestination: "Điểm đến",
    summaryPurpose: "Mục đích/Chủ đề",
    summaryCompanion: "Người đồng hành",
    summaryDuration: "Thời gian",
    summaryBudget: "Ngân sách",
    summaryMustDo: "Việc nhất định phải làm",
    summaryMustHave: "Đồ vật cần thiết",
    summaryReason: "Lý do đi du lịch",
    generateScriptBtn: "Tạo bài thuyết trình du lịch",
    generatingScript: "Đang tạo bài thuyết trình...",
    generatingScriptDesc: "Đang tạo bài thuyết trình tiếng Hàn được cá nhân hóa dựa trên kế hoạch du lịch của bạn.",

    // Script Revision
    scriptEditorTitle: "Chỉnh Sửa Bài Thuyết Trình",
    scriptEditorInstruction: "Hãy đọc bài thuyết trình. Nếu muốn thay đổi câu nào, hãy bấm vào câu đó.",
    sentenceClickHint: "Bấm vào câu bất kỳ để yêu cầu sửa theo ý bạn!",
    selectedSentenceLabel: "Câu đã chọn",
    revisionModalTitle: "Chỉnh Sửa Câu",
    revisionModalPrompt: "Bạn muốn sửa câu này như thế nào?",
    revisionModalPlaceholder: "VD: Nhấn mạnh việc đi cùng bạn bè, diễn đạt dễ hiểu hơn, thêm phần sinh động...",
    revisionSuggestionsLabel: "💡 Gợi ý yêu cầu bạn có thể thử:",
    suggestion1: "Nhấn mạnh hơn việc tôi đi cùng bạn thân.",
    suggestion2: "Hãy viết lại sao cho thú vị và sinh động hơn.",
    suggestion3: "Từ ngữ hơi khó, hãy đổi sang từ dễ hiểu hơn.",
    suggestion4: "Hãy viết ngắn gọn và súc tích hơn.",
    suggestion5: "Hãy viết như thể tôi đang trực tiếp trò chuyện với bạn bè.",
    revisingBtn: "Sửa câu này",
    revisingSentence: "AI đang chỉnh sửa câu...",
    revisionCountBadge: "Số lần sửa",
    finalizeScriptBtn: "Hoàn tất bài thuyết trình",
    finalizeConfirmTitle: "Lưu bài thuyết trình thành bản chính thức?",
    finalizeConfirmMessage: "Sau khi hoàn tất, bài thuyết trình sẽ được lưu làm bản chính thức để bạn trình bày trước lớp.",
    continueRevisingBtn: "Tiếp tục chỉnh sửa",
    confirmFinalizeBtn: "Lưu bản chính thức",

    // Waiting / Presenter
    presenterTitle: "Bài Thuyết Trình Chính Thức",
    presenterSubtitle: "Hãy nhìn vào màn hình này và tập phát biểu to rõ ràng trước lớp.",
    practiceSpeakingTip: "🗣️ Hãy luyện đọc to rõ ràng trong vòng 1 phút nhé!",
    waitingForCardsTitle: "Đang chờ giáo viên công bố thẻ du lịch...",
    waitingForCardsDesc: "Khi tất cả các bạn thuyết trình xong, thẻ du lịch sẽ được mở và bắt đầu bình chọn.",
    refreshStatus: "Làm mới",

    // Voting
    votingTitle: "Khám Phá Chuyến Đi Của Các Bạn!",
    votingSubtitle: "Hãy bình chọn cho chuyến đi của bạn bè mà bạn muốn tham gia nhất (Mỗi người 1 phiếu).",
    myTripBadge: "Chuyến đi của tôi",
    myTripDesc: "Bạn không thể bình chọn cho chuyến đi của chính mình.",
    voteBtn: "Tôi muốn tham gia chuyến đi này",
    voteConfirmTitle: "Bạn có muốn bình chọn cho chuyến đi này?",
    voteConfirmMessage: "Sau khi bình chọn sẽ không thể thay đổi. Bạn có chắc chắn chọn chuyến đi này?",
    voteSuccessTitle: "Bình chọn hoàn tất!",
    voteSuccessMessage: "Vui lòng chờ giáo viên công bố kết quả.",
    votingClosedNotice: "Thời gian bình chọn đã kết thúc. Hãy đón chờ kết quả từ giáo viên!",
    alreadyVotedNotice: "Bạn đã hoàn thành bình chọn. Vui lòng chờ kết quả.",

    // Teacher
    teacherLoginTitle: "Đăng Nhập Giáo Viên",
    teacherPasswordLabel: "Mật khẩu giáo viên",
    teacherPasswordPlaceholder: "Nhập 4 chữ số mật khẩu",
    loginBtn: "Đăng nhập",
    createNewRoomBtn: "Tạo Lớp Học Mới",
    creatingRoom: "Đang tạo lớp học...",
    activeClassroom: "Lớp học hiện tại",
    classRoomCodeLabel: "Mã phòng học",
    participantsCount: "Học sinh tham gia",
    tableColStudent: "Học sinh",
    tableColDestination: "Điểm đến",
    tableColStatus: "Tiến độ",
    tableColRevisions: "Số lần sửa",
    tableColActions: "Chi tiết",
    viewStudentWork: "Xem bài & Câu hỏi",
    noParticipantsYet: "Chưa có học sinh nào tham gia. Vui lòng hướng dẫn học sinh nhập mã phòng.",
    revealCardsBtn: "Công bố Thẻ Du Lịch",
    cardsRevealedNotice: "Đã công bố thẻ du lịch. Học sinh có thể bắt đầu bình chọn.",
    closeVotingBtn: "Kết Thúc Bình Chọn",
    votingClosedState: "Đã đóng bình chọn.",
    viewResultsBtn: "Xem Kết Quả Bình Chọn",
    votingResultsTitle: "Kết Quả Bình Chọn Chuyến Đi",
    votingResultsDesc: "Xếp hạng các chuyến đi được học sinh yêu thích và muốn tham gia nhất.",
    rankLabel: "Hạng",
    votesCountLabel: "Phiếu",
    listeningQuizTitle: "Câu Hỏi Luyện Nghe (Rung Chuông Vàng)",
    listeningQuizDesc: "Bộ 3 câu hỏi nghe hiểu được tạo tự động dựa trên bài thuyết trình chính thức của học sinh.",
    questionLabel: "Câu hỏi",
    answerLabel: "Đáp án",
    revisionHistoryTitle: "Lịch Sử Chỉnh Sửa Câu",
    revisionNumberLabel: "Lần",
    originalTextLabel: "Trước khi sửa",
    studentRequestLabel: "Yêu cầu của học sinh",
    revisedTextLabel: "Sau khi sửa",
    closeModal: "Đóng",

    // Errors
    errorRoomNotFound: "Không tìm thấy mã phòng học. Vui lòng kiểm tra lại.",
    errorNameRequired: "Vui lòng nhập tên hoặc biệt danh.",
    errorDuplicateName: "Tên này đã có người sử dụng. Vui lòng thêm số hoặc chọn tên khác.",
    errorGeneric: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    errorInvalidPassword: "Mật khẩu không chính xác.",
    errorCannotVoteSelf: "Bạn không thể bình chọn cho chính mình.",
    errorAlreadyVoted: "Bạn đã bình chọn rồi.",
    errorVotingClosed: "Bình chọn đã kết thúc.",
  }
};
