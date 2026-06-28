import { create } from 'zustand';
import { Submission, SubmissionFilters, SubmissionVerdict } from '../lib/types';
import { initialSubmissions } from '../data/mock/mockData';
import { applySubmissionFilters } from '../lib/engines/filterEngine';
import { useParticipantStore } from './participantStore';
import { useActivityStore } from './activityStore';

interface SubmissionState {
  submissions: Submission[];
  filteredSubmissions: Submission[];
  filters: SubmissionFilters;
  
  updateSubmissionVerdict: (submissionId: string, newVerdict: SubmissionVerdict) => void;
  setFilters: (filters: Partial<SubmissionFilters>) => void;
  addSubmission: (submission: Omit<Submission, 'id'>) => void;
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  submissions: initialSubmissions,
  filteredSubmissions: initialSubmissions,
  filters: {
    verdict: 'All',
    problemId: 'All',
    searchTerm: ''
  },

  updateSubmissionVerdict: (submissionId, newVerdict) => {
    let affectedParticipantId = '';
    let affectedParticipantName = '';
    let problemId = '';
    let oldVerdict: SubmissionVerdict = 'Pending';

    set(state => {
      const updatedSubmissions = state.submissions.map(s => {
        if (s.id === submissionId) {
          affectedParticipantId = s.participantId;
          affectedParticipantName = s.participantName;
          problemId = s.problemId;
          oldVerdict = s.verdict;
          return { ...s, verdict: newVerdict };
        }
        return s;
      });

      return {
        submissions: updatedSubmissions,
        filteredSubmissions: applySubmissionFilters(updatedSubmissions, state.filters)
      };
    });

    if (affectedParticipantId) {
      // Cascade 1: Sync participant score (recalculates ranks and syncs contest metrics)
      useParticipantStore.getState().syncParticipantScore(affectedParticipantId);

      // Cascade 2: Log activity
      useActivityStore.getState().logActivity(
        'rejudge',
        `Submission ${submissionId} (${affectedParticipantName} - Problem ${problemId}) rejudged from ${oldVerdict} to ${newVerdict}.`
      );
    }
  },

  setFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      return {
        filters: updatedFilters,
        filteredSubmissions: applySubmissionFilters(state.submissions, updatedFilters)
      };
    });
  },

  addSubmission: (submissionData) => {
    const newSub: Submission = {
      ...submissionData,
      id: `sub-${get().submissions.length + 1}`
    };

    set(state => {
      // Submissions are ordered chronologically, so we append them
      const updatedSubmissions = [...state.submissions, newSub];
      return {
        submissions: updatedSubmissions,
        filteredSubmissions: applySubmissionFilters(updatedSubmissions, state.filters)
      };
    });

    // Cascade 1: Sync participant score
    useParticipantStore.getState().syncParticipantScore(newSub.participantId);

    // Cascade 2: Log activity
    useActivityStore.getState().logActivity(
      'submission',
      `New submission received from ${newSub.participantName} for Problem ${newSub.problemId} (${newSub.verdict}).`
    );
  }
}));
