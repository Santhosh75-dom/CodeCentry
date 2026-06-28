import Head from 'next/head';
import FilterPanel from '../components/participants/FilterPanel';
import ParticipantTable from '../components/participants/ParticipantTable';

export default function ParticipantsPage() {
  return (
    <>
      <Head>
        <title>Participants | CodeChef Contest Control Center</title>
        <meta name="description" content="Manage and search contest participants." />
      </Head>

      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Participant Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Search, sort, filter, and monitor all active participants in the contest.
          </p>
        </div>

        {/* Multi-level filter panel */}
        <FilterPanel />

        {/* Participant Table */}
        <ParticipantTable />
      </div>
    </>
  );
}
