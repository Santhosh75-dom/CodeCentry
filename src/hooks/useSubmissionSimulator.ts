import { useEffect } from 'react';
import { useParticipantStore, useSubmissionStore, useContestStore } from '../stores';
import { mockProblems } from '../data/mock/mockData';
import { SubmissionVerdict } from '../lib/types';

export function useSubmissionSimulator() {
  const { participants } = useParticipantStore();
  const { addSubmission, updateSubmissionVerdict, submissions } = useSubmissionStore();
  const { status } = useContestStore();

  useEffect(() => {
    // Only simulate if the contest is active (live)
    if (status !== 'live' || participants.length === 0) return;

    const interval = setInterval(() => {
      // 1. Pick a random active participant
      const activeParticipants = participants.filter(p => p.status === 'Active');
      if (activeParticipants.length === 0) return;
      const participant = activeParticipants[Math.floor(Math.random() * activeParticipants.length)];

      // 2. Pick a random problem
      const problem = mockProblems[Math.floor(Math.random() * mockProblems.length)];

      // 3. Pick a random programming language
      const languages = ['C++', 'Python 3', 'Java', 'Go', 'Rust'];
      const language = languages[Math.floor(Math.random() * languages.length)];

      // 4. Calculate submission time relative to contest (just use current local time formatted relative or elapsed)
      const date = new Date();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      // 5. Add a "Running" submission to show real-time grading state!
      // We pass without ID as addSubmission generates it, but we need to know the ID it created.
      // So let's look at how addSubmission assigns ID: `sub-${submissions.length + 1}`.
      // Let's call addSubmission.
      addSubmission({
        participantId: participant.id,
        participantName: participant.name,
        problemId: problem.id,
        problemName: problem.name,
        submissionTime: timeStr,
        verdict: 'Running',
        language
      });

      // 6. After 2.5 seconds, grade the submission and update the verdict
      setTimeout(() => {
        // Find the newly added submission ID
        const newestSubId = `sub-${useSubmissionStore.getState().submissions.length}`;
        
        // Randomly grade verdict
        const rand = Math.random();
        let finalVerdict: SubmissionVerdict = 'Wrong Answer';
        if (rand < 0.6) {
          finalVerdict = 'Accepted';
        } else if (rand < 0.8) {
          finalVerdict = 'Wrong Answer';
        } else if (rand < 0.9) {
          finalVerdict = 'Time Limit Exceeded';
        } else {
          finalVerdict = 'Runtime Error';
        }

        updateSubmissionVerdict(newestSubId, finalVerdict);
      }, 2500);

    }, 15000); // Trigger a new submission every 15 seconds

    return () => clearInterval(interval);
  }, [status, participants, addSubmission, updateSubmissionVerdict, submissions.length]);
}
