import Head from 'next/head';
import ContestOverview from '../components/dashboard/ContestOverview';
import ContestCountdown from '../components/dashboard/ContestCountdown';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import styles from '../components/dashboard/Dashboard.module.css';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | CodeChef Contest Control Center</title>
        <meta name="description" content="Contest metrics, live status, and real-time activity feed." />
      </Head>

      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Overview Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time status monitoring, metrics aggregation, and event logging.
          </p>
        </div>

        {/* 5 Stats Cards */}
        <ContestOverview />

        {/* Countdown & Activity Timeline Grid */}
        <div className={styles.timerSection}>
          <ContestCountdown />
          <ActivityFeed />
        </div>
      </div>
    </>
  );
}
