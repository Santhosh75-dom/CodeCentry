import Head from 'next/head';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  return (
    <>
      <Head>
        <title>Leaderboard | CodeChef Contest Control Center</title>
        <meta name="description" content="View live rankings and statistics of contest participants." />
      </Head>

      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Contest Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            View live ranks (top 50), lock rankings with Freeze Mode, and export the final statistics to CSV.
          </p>
        </div>

        {/* Leaderboard Table & Controls */}
        <LeaderboardTable />
      </div>
    </>
  );
}
