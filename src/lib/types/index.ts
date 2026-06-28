export type ContestStatus = 'upcoming' | 'live' | 'ended';

export interface Contest {
  id: string;
  name: string;
  status: ContestStatus;
  startTime: string; // ISO string
  endTime: string; // ISO string
  totalProblems: number;
  totalParticipants: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  rejectedSubmissions: number;
  countdown: number; // in seconds
}

export type ParticipantStatus = 'Active' | 'Disqualified' | 'Inactive';

export interface Participant {
  id: string;
  name: string;
  institution: string;
  currentRank: number;
  problemsSolved: number;
  penaltyTime: number; // in minutes
  status: ParticipantStatus;
}

export type SubmissionVerdict = 
  | 'Pending'
  | 'Running'
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Runtime Error';

export interface Submission {
  id: string;
  participantId: string;
  participantName: string;
  problemId: string;
  problemName: string;
  submissionTime: string; // HH:MM:SS (relative to contest start)
  verdict: SubmissionVerdict;
  language: string;
}

export type ActivityType = 'joined' | 'submission' | 'rejudge' | 'frozen' | 'unfrozen';

export interface Activity {
  id: string;
  timestamp: string; // ISO or formatted HH:MM:SS
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface ParticipantFilters {
  searchTerm: string;
  selectedInstitution: string;
  minRank: number | '';
  maxRank: number | '';
  minProblemsSolved: number | '';
}

export interface SubmissionFilters {
  verdict: string; // 'All' or a specific verdict
  problemId: string; // 'All' or specific problem ID
  searchTerm: string; // Search by participant name
}
