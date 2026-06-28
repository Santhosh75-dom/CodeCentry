import { Participant, ParticipantFilters, Submission, SubmissionFilters } from '../types';

/**
 * Filter participants with AND logic (all active filters must match).
 */
export function applyParticipantFilters(
  participants: Participant[],
  filters: ParticipantFilters
): Participant[] {
  return participants.filter(p => {
    // 1. Search term (case-insensitive name match)
    if (filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase();
      if (!p.name.toLowerCase().includes(term)) {
        return false;
      }
    }

    // 2. Institution filter
    if (filters.selectedInstitution && filters.selectedInstitution !== 'All') {
      if (p.institution !== filters.selectedInstitution) {
        return false;
      }
    }

    // 3. Min Rank filter (currentRank >= minRank)
    if (filters.minRank !== '') {
      if (p.currentRank < filters.minRank) {
        return false;
      }
    }

    // 4. Max Rank filter (currentRank <= maxRank)
    if (filters.maxRank !== '') {
      if (p.currentRank > filters.maxRank) {
        return false;
      }
    }

    // 5. Min Problems Solved (problemsSolved >= minProblemsSolved)
    if (filters.minProblemsSolved !== '') {
      if (p.problemsSolved < filters.minProblemsSolved) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter submissions with AND logic.
 */
export function applySubmissionFilters(
  submissions: Submission[],
  filters: SubmissionFilters
): Submission[] {
  return submissions.filter(s => {
    // 1. Verdict filter
    if (filters.verdict && filters.verdict !== 'All') {
      if (s.verdict !== filters.verdict) {
        return false;
      }
    }

    // 2. Problem filter
    if (filters.problemId && filters.problemId !== 'All') {
      if (s.problemId !== filters.problemId) {
        return false;
      }
    }

    // 3. Participant name search (case-insensitive)
    if (filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase();
      if (!s.participantName.toLowerCase().includes(term)) {
        return false;
      }
    }

    return true;
  });
}
