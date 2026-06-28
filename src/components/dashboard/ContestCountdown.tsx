import { useState, useEffect } from 'react';
import { useContestStore } from '../../stores';
import { useContestTimer } from '../../hooks/useContestTimer';
import styles from './Dashboard.module.css';

export default function ContestCountdown() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Activate the ticking countdown interval
  useContestTimer();

  const { countdown, status, setContestStatus } = useContestStore();

  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return (
          <span className={`${styles.badge} ${styles.badgeLive}`}>
            <span className={styles.liveIndicator}></span> Live
          </span>
        );
      case 'ended':
        return (
          <span className={`${styles.badge} ${styles.badgeEnded}`}>
            <span className={styles.endedIndicator}></span> Ended
          </span>
        );
      case 'upcoming':
        return (
          <span className={`${styles.badge} ${styles.badgeUpcoming}`}>
            <span className={styles.upcomingIndicator}></span> Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const handleToggleStatus = () => {
    // Allows toggling for testing purposes
    const nextStatus = status === 'live' ? 'ended' : 'live';
    setContestStatus(nextStatus);
  };

  if (!mounted) {
    return (
      <div className={`${styles.timerCard} glass-panel`}>
        <div className={styles.timerTitle}>Contest Status</div>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading countdown timer...
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.timerCard} glass-panel`}>
      <div className={styles.timerTitle}>
        Contest Status
        {getStatusBadge()}
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>{pad(hours)}</div>
          <div className={styles.timeLabel}>Hours</div>
        </div>
        <div className={styles.timerColon}>:</div>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>{pad(minutes)}</div>
          <div className={styles.timeLabel}>Minutes</div>
        </div>
        <div className={styles.timerColon}>:</div>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>{pad(seconds)}</div>
          <div className={styles.timeLabel}>Seconds</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleToggleStatus}
          className={`${styles.badge} ${status === 'live' ? styles.badgeEnded : styles.badgeLive}`}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          Simulate {status === 'live' ? 'End' : 'Start'}
        </button>
      </div>
    </div>
  );
}
