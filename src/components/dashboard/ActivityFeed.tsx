import { useState, useEffect } from 'react';
import { useActivityStore } from '../../stores';
import styles from './Dashboard.module.css';

export default function ActivityFeed() {
  const { activities, clearActivities } = useActivityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'joined':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        );
      case 'submission':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        );
      case 'rejudge':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3-9h12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M3 12l3 3m-3-3-3 3" />
          </svg>
        );
      case 'frozen':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        );
      case 'unfrozen':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getFormatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  // Show only last 15 activities as per PRD
  const displayActivities = activities.slice(0, 15);

  if (!mounted) {
    return (
      <div className={`${styles.feedCard} glass-panel`}>
        <div className={styles.feedTitle}>
          Recent Activity
        </div>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading activity feed...
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.feedCard} glass-panel`}>
      <div className={styles.feedTitle}>
        Recent Activity
        <button
          onClick={clearActivities}
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <div className={styles.feedItems}>
        {displayActivities.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No recent activity.
          </div>
        ) : (
          displayActivities.map(activity => (
            <div key={activity.id} className={styles.feedItem}>
              <div className={`${styles.feedIcon} ${styles[`feedIcon_${activity.type}`]}`}>
                {getEventIcon(activity.type)}
              </div>
              <div className={styles.feedContent}>
                <div className={styles.feedText}>{activity.description}</div>
                <div className={styles.feedTime}>{getFormatTime(activity.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
