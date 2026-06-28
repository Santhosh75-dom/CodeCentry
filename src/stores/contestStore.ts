import { create } from 'zustand';
import { Contest, ContestStatus, Submission } from '../lib/types';
import mockData from '../data/mock/mockData';
import { useSubmissionStore } from './submissionStore';
import { useParticipantStore } from './participantStore';

interface ContestState extends Contest {
  setContestStatus: (status: ContestStatus) => void;
  updateCountdown: () => void;
  syncMetrics: () => void;
}

// Contest duration in seconds (5 hours)
const CONTEST_DURATION = 5 * 60 * 60;

export const useContestStore = create<ContestState>((set) => ({
  id: 'codechef-vitch-2026',
  name: 'CodeChef Contest Control Center',
  status: 'live',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + CONTEST_DURATION * 1000).toISOString(),
  totalProblems: mockData.problems.length,
  totalParticipants: mockData.participants.length,
  totalSubmissions: mockData.submissions.length,
  acceptedSubmissions: mockData.submissions.filter(s => s.verdict === 'Accepted').length,
  rejectedSubmissions: mockData.submissions.filter(s => s.verdict !== 'Accepted').length,
  countdown: CONTEST_DURATION,

  setContestStatus: (status) => set({ status }),

  updateCountdown: () => {
    set(state => {
      if (state.countdown <= 0) {
        return { countdown: 0, status: 'ended' };
      }
      return { countdown: state.countdown - 1 };
    });
  },

  syncMetrics: () => {
    const { submissions } = useSubmissionStore.getState();
    const { participants } = useParticipantStore.getState();

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter((s: Submission) => s.verdict === 'Accepted').length;
    const rejectedSubmissions = totalSubmissions - acceptedSubmissions;
    const totalParticipants = participants.length;

    set({
      totalSubmissions,
      acceptedSubmissions,
      rejectedSubmissions,
      totalParticipants
    });
  }
}));
