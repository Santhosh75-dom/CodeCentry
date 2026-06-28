import { Participant } from '../types';

/**
 * Calculates rankings based on competitive programming rules:
 * 1. Active / Inactive participants are ranked higher than Disqualified.
 * 2. Primary: Problems solved (descending - more is better)
 * 3. Secondary: Penalty time (ascending - lower is better, tiebreaker)
 * 4. Ranks are assigned chronologically from 1.
 */
export function calculateRankings(participants: Participant[]): Participant[] {
  const ranked = [...participants];

  ranked.sort((a, b) => {
    // Disqualified participants go to the bottom
    if (a.status === 'Disqualified' && b.status !== 'Disqualified') return 1;
    if (b.status === 'Disqualified' && a.status !== 'Disqualified') return -1;
    if (a.status === 'Disqualified' && b.status === 'Disqualified') return 0;

    // Problems solved (descending)
    if (b.problemsSolved !== a.problemsSolved) {
      return b.problemsSolved - a.problemsSolved;
    }

    // Penalty time (ascending)
    return a.penaltyTime - b.penaltyTime;
  });

  // Assign ranks
  return ranked.map((p, idx) => ({
    ...p,
    currentRank: idx + 1
  }));
}
