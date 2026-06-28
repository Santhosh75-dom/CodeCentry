import Head from 'next/head';
import SubmissionFilters from '../components/submissions/SubmissionFilters';
import SubmissionTable from '../components/submissions/SubmissionTable';

export default function SubmissionsPage() {
  return (
    <>
      <Head>
        <title>Submissions | CodeChef Contest Control Center</title>
        <meta name="description" content="Monitor and rejudge contest submissions in real-time." />
      </Head>

      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Submission Monitoring
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Monitor live solution runs, apply verdict and problem filters, and click on any verdict to rejudge.
          </p>
        </div>

        {/* Filters */}
        <SubmissionFilters />

        {/* Submissions Table */}
        <SubmissionTable />
      </div>
    </>
  );
}
