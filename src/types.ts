export type Language = 'ko' | 'vi';

export type StudentStage = 'join' | 'questionnaire' | 'summary' | 'editor' | 'waiting' | 'voting';

export interface TravelData {
  destination: string;
  customDestination?: string;
  purpose: string;
  customPurpose?: string;
  companion: string;
  customCompanion?: string;
  duration: string;
  budget: string;
  mustDo: string;
  mustHave: string;
  reason: string;
}

export interface RevisionRecord {
  id: string;
  revisionNumber: number;
  timestamp: number;
  sentenceIndex: number;
  originalSentence: string;
  studentRequest: string;
  revisedSentence: string;
  fullScriptAfter: string;
}

export interface ListeningQuiz {
  id: string;
  participantId: string;
  displayName: string;
  destination: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  createdAt: number;
}

export interface TravelCard {
  participantId: string;
  displayName: string;
  destination: string;
  theme: string;
  companion: string;
  duration: string;
  budget: string;
  mustDo: string;
  shortDescription: string;
}

export type ParticipantStatus = 'planning' | 'revising' | 'completed';

export interface Participant {
  id: string;
  classroomId: string;
  displayName: string;
  joinedAt: number;
  status: ParticipantStatus;
  travelData?: TravelData;
  sentences: string[];
  fullScript: string;
  revisionCount: number;
  revisionHistory: RevisionRecord[];
  completedAt?: number;
  finalScript?: string;
  travelCard?: TravelCard;
  votedForParticipantId?: string;
}

export interface Classroom {
  id: string;
  roomCode: string;
  title: string;
  createdAt: number;
  cardRevealState: boolean;
  votingClosed: boolean;
}

export interface VoteResult {
  participantId: string;
  displayName: string;
  destination: string;
  theme: string;
  voteCount: number;
  rank: number;
}

export interface ClassroomSummary {
  id: string;
  roomCode: string;
  title: string;
  createdAt: number;
  cardRevealState: boolean;
  votingClosed: boolean;
  participantsCount: number;
  completedCount: number;
  revisingCount: number;
  totalVotes: number;
}

export interface TeacherClassroomData {
  classroom: Classroom;
  participants: Participant[];
  quizzes: Record<string, ListeningQuiz>;
  voteResults?: VoteResult[];
  totalVotes: number;
  allClassrooms?: ClassroomSummary[];
}
