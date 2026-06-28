import { useParticipantStore } from '../../stores';
import Pagination from './Pagination';
import styles from './Participants.module.css';

export default function ParticipantTable() {
  const {
    filteredParticipants,
    sortBy,
    setSortBy,
    currentPage,
    pageSize,
    setCurrentPage
  } = useParticipantStore();

  const totalItems = filteredParticipants.length;
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const displayParticipants = filteredParticipants.slice(pageStart, pageEnd);

  const getSortIndicator = (field: 'rank' | 'name' | 'penalty') => {
    if (sortBy === field) {
      return ' ▾'; // Descending or active indicator
    }
    return '';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'Inactive':
        return styles.statusInactive;
      case 'Disqualified':
        return styles.statusDisqualified;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.tableContainer} glass-panel`} style={{ padding: '8px' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => setSortBy('rank')} style={{ width: '10%' }}>
                Rank{getSortIndicator('rank')}
              </th>
              <th onClick={() => setSortBy('name')} style={{ width: '30%' }}>
                Name{getSortIndicator('name')}
              </th>
              <th style={{ width: '25%' }}>Institution</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Problems Solved</th>
              <th onClick={() => setSortBy('penalty')} style={{ width: '10%' }}>
                Penalty{getSortIndicator('penalty')}
              </th>
              <th style={{ width: '10%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayParticipants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No participants matched your filters.
                </td>
              </tr>
            ) : (
              displayParticipants.map(p => (
                <tr key={p.id}>
                  <td className={styles.rank} data-label="Rank">
                    #{p.currentRank}
                  </td>
                  <td className={styles.name} data-label="Name">
                    {p.name}
                  </td>
                  <td className={styles.institution} data-label="Institution">
                    {p.institution}
                  </td>
                  <td className={styles.problemsSolved} data-label="Problems Solved">
                    {p.problemsSolved}
                  </td>
                  <td className={styles.penaltyTime} data-label="Penalty Time">
                    {p.penaltyTime} min
                  </td>
                  <td data-label="Status">
                    <span className={`${styles.statusBadge} ${getStatusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
