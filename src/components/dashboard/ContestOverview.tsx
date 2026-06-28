import { useContestStore } from '../../stores';
import StatsCard from './StatsCard';
import styles from './Dashboard.module.css';

export default function ContestOverview() {
  const {
    totalParticipants,
    totalProblems,
    totalSubmissions,
    acceptedSubmissions,
    rejectedSubmissions
  } = useContestStore();

  const successRate = totalSubmissions > 0 
    ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) 
    : '0.0';

  const rejectRate = totalSubmissions > 0 
    ? ((rejectedSubmissions / totalSubmissions) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className={styles.dashboardGrid}>
      {/* Total Participants */}
      <StatsCard
        label="Total Participants"
        value={totalParticipants}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 22, height: 22 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        }
        footer={<span>Registered contest accounts</span>}
      />

      {/* Total Problems */}
      <StatsCard
        label="Total Problems"
        value={totalProblems}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 22, height: 22 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        }
        footer={<span>Active contest tasks</span>}
      />

      {/* Total Submissions */}
      <StatsCard
        label="Total Submissions"
        value={totalSubmissions}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 22, height: 22 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m-6.42 2.25H19.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        }
        footer={<span>Runs evaluated by judge</span>}
      />

      {/* Accepted Submissions */}
      <StatsCard
        label="Accepted Submissions"
        value={acceptedSubmissions}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 22, height: 22, color: 'var(--accent-emerald)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        footer={
          <span>
            Success rate: <span className={styles.successRate}>{successRate}%</span>
          </span>
        }
      />

      {/* Rejected Submissions */}
      <StatsCard
        label="Rejected Submissions"
        value={rejectedSubmissions}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 22, height: 22, color: 'var(--accent-rose)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        footer={
          <span>
            Failure rate: <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{rejectRate}%</span>
          </span>
        }
      />
    </div>
  );
}
