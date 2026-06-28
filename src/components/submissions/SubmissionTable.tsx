import { useState } from 'react';
import { useSubmissionStore } from '../../stores';
import { Submission } from '../../lib/types';
import VerdictBadge from './VerdictBadge';
import RejudgeModal from './RejudgeModal';
import Pagination from '../participants/Pagination';
import styles from './Submissions.module.css';

export default function SubmissionTable() {
  const { filteredSubmissions } = useSubmissionStore();

  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Pagination local state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Reset page if filtered submissions size changes and current page overflows
  const safePage = currentPage > totalPages ? 1 : currentPage;

  // We want to show submissions in reverse chronological order (newest first)
  // Our seed generator sorted them chronologically, so we reverse the filtered list for visual display.
  const reversedSubmissions = [...filteredSubmissions].reverse();
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const displaySubmissions = reversedSubmissions.slice(pageStart, pageEnd);

  const handleVerdictClick = (sub: Submission) => {
    setSelectedSub(sub);
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.tableContainer} glass-panel`} style={{ padding: '8px' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Participant Name</th>
              <th style={{ width: '25%' }}>Problem Name</th>
              <th style={{ width: '15%' }}>Submission Time</th>
              <th style={{ width: '20%' }}>Verdict</th>
              <th style={{ width: '15%' }}>Language Used</th>
            </tr>
          </thead>
          <tbody>
            {displaySubmissions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No submissions matched your filters.
                </td>
              </tr>
            ) : (
              displaySubmissions.map(sub => (
                <tr key={sub.id}>
                  <td className={styles.participantName} data-label="Participant">
                    {sub.participantName}
                  </td>
                  <td className={styles.problemName} data-label="Problem">
                    {sub.problemId} - {sub.problemName}
                  </td>
                  <td className={styles.subTime} data-label="Time">
                    {sub.submissionTime}
                  </td>
                  <td
                    className={styles.verdictCell}
                    onClick={() => handleVerdictClick(sub)}
                    data-label="Verdict"
                  >
                    <VerdictBadge verdict={sub.verdict} />
                    <span className={styles.rejudgeIndicator}>✎ Rejudge</span>
                  </td>
                  <td className={styles.language} data-label="Language">
                    {sub.language}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={safePage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <RejudgeModal
        isOpen={modalOpen}
        submission={selectedSub}
        onClose={() => {
          setModalOpen(false);
          setSelectedSub(null);
        }}
      />
    </div>
  );
}
