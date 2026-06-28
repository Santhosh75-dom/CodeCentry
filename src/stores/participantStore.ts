import { create } from 'zustand';
import { Participant, ParticipantFilters, Submission } from '../lib/types';
import { initialParticipants } from '../data/mock/mockData';
import { calculateRankings } from '../lib/engines/rankingEngine';
import { applyParticipantFilters } from '../lib/engines/filterEngine';
import { useUIStore } from './uiStore';
import { useSubmissionStore } from './submissionStore';
import { useContestStore } from './contestStore';

interface ParticipantState {
  participants: Participant[];
  rankedParticipants: Participant[];
  filteredParticipants: Participant[];
  filters: ParticipantFilters;
  sortBy: 'rank' | 'name' | 'penalty';
  currentPage: number;
  pageSize: number;

  recalculateRankings: () => void;
  setFilters: (filters: Partial<ParticipantFilters>) => void;
  setSortBy: (field: 'rank' | 'name' | 'penalty') => void;
  setCurrentPage: (page: number) => void;
  syncParticipantScore: (participantId: string) => void;
}

export const useParticipantStore = create<ParticipantState>((set, get) => ({
  participants: initialParticipants,
  rankedParticipants: initialParticipants, // initially sorted in mockData
  filteredParticipants: initialParticipants,
  filters: {
    searchTerm: '',
    selectedInstitution: 'All',
    minRank: '',
    maxRank: '',
    minProblemsSolved: ''
  },
  sortBy: 'rank',
  currentPage: 1,
  pageSize: 10,

  recalculateRankings: () => {
    const { isFrozen } = useUIStore.getState();
    
    // We only change rankings/ranks if NOT frozen
    if (!isFrozen) {
      set(state => {
        const newlyRanked = calculateRankings(state.participants);
        const filtered = applyParticipantFilters(newlyRanked, state.filters);
        
        // Apply current sort after filter
        const sorted = [...filtered];
        const { sortBy } = state;
        if (sortBy === 'name') {
          sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'penalty') {
          sorted.sort((a, b) => a.penaltyTime - b.penaltyTime);
        } else {
          sorted.sort((a, b) => a.currentRank - b.currentRank);
        }

        return {
          rankedParticipants: newlyRanked,
          filteredParticipants: sorted,
          participants: state.participants.map(p => {
            const found = newlyRanked.find(nr => nr.id === p.id);
            return found ? found : p;
          })
        };
      });
    } else {
      // If frozen, we still want to apply filters to the current ranked participants
      set(state => {
        const filtered = applyParticipantFilters(state.rankedParticipants, state.filters);
        
        const sorted = [...filtered];
        const { sortBy } = state;
        if (sortBy === 'name') {
          sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'penalty') {
          sorted.sort((a, b) => a.penaltyTime - b.penaltyTime);
        } else {
          sorted.sort((a, b) => a.currentRank - b.currentRank);
        }

        return {
          filteredParticipants: sorted
        };
      });
    }
  },

  setFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filtered = applyParticipantFilters(state.rankedParticipants, updatedFilters);
      
      // Apply sorting on filtered list
      const sorted = [...filtered];
      const { sortBy } = state;
      if (sortBy === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'penalty') {
        sorted.sort((a, b) => a.penaltyTime - b.penaltyTime);
      } else {
        sorted.sort((a, b) => a.currentRank - b.currentRank);
      }

      return {
        filters: updatedFilters,
        filteredParticipants: sorted,
        currentPage: 1 // reset to page 1
      };
    });
  },

  setSortBy: (field) => {
    set(state => {
      const sorted = [...state.filteredParticipants];
      if (field === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (field === 'penalty') {
        sorted.sort((a, b) => a.penaltyTime - b.penaltyTime);
      } else {
        sorted.sort((a, b) => a.currentRank - b.currentRank);
      }
      return {
        sortBy: field,
        filteredParticipants: sorted,
        currentPage: 1
      };
    });
  },

  setCurrentPage: (currentPage) => set({ currentPage }),

  syncParticipantScore: (participantId) => {
    // 1. Get submissions from submission store
    const { submissions } = useSubmissionStore.getState();
    const pSubmissions = submissions.filter((s: Submission) => s.participantId === participantId);

    // 2. Sort chronologically
    pSubmissions.sort((a, b) => a.submissionTime.localeCompare(b.submissionTime));

    // 3. Compute score & penalty
    let solvedCount = 0;
    let totalPenalty = 0;
    const solvedProblems = new Set<string>();
    const failedCounts: Record<string, number> = {};

    pSubmissions.forEach((sub) => {
      if (solvedProblems.has(sub.problemId)) {
        return;
      }

      if (sub.verdict === 'Accepted') {
        solvedProblems.add(sub.problemId);
        solvedCount++;

        const [h, m] = sub.submissionTime.split(':').map(Number);
        const subMinutes = h * 60 + m;

        const failedBefore = failedCounts[sub.problemId] || 0;
        totalPenalty += subMinutes + failedBefore * 20;
      } else if (sub.verdict !== 'Pending' && sub.verdict !== 'Running') {
        // Pending/Running does not count towards penalty
        failedCounts[sub.problemId] = (failedCounts[sub.problemId] || 0) + 1;
      }
    });

    // 4. Update the participant in store
    set(state => {
      const updatedParticipants = state.participants.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            problemsSolved: solvedCount,
            penaltyTime: totalPenalty
          };
        }
        return p;
      });

      const updatedRankedParticipants = state.rankedParticipants.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            problemsSolved: solvedCount,
            penaltyTime: totalPenalty
          };
        }
        return p;
      });

      return {
        participants: updatedParticipants,
        rankedParticipants: updatedRankedParticipants
      };
    });

    // 5. Recalculate rankings (handles frozen check internally)
    get().recalculateRankings();
    
    // 6. Sync metrics in contest store
    useContestStore.getState().syncMetrics();
  }
}));
