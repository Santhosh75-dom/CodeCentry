import { useEffect } from 'react';
import { useContestStore } from '../stores';

export function useContestTimer() {
  const { updateCountdown, status } = useContestStore();

  useEffect(() => {
    if (status !== 'live') return;

    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, updateCountdown]);
}
