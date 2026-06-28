import { useUIStore, useParticipantStore } from '../../stores';
import { exportLeaderboardToCSV } from '../../lib/utils/csvExporter';
import styles from './Leaderboard.module.css';

export default function LeaderboardTable() {
  const { isFrozen, frozenSnapshot, toggleFreeze } = useUIStore();
  const { rankedParticipants } = useParticipantStore();

  // Determine active dataset: if frozen, render snapshot; otherwise live rankings
  const activeList = isFrozen ? frozenSnapshot : rankedParticipants;
  const displayList = activeList.slice(0, 50); // display top 50 as per PRD

  const handleExportCSV = () => {
    exportLeaderboardToCSV(activeList);
  };

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return '';
  };

  return (
    <div className={styles.container}>
      {/* Controls Bar */}
      <div className={`${styles.controls} glass-panel`}>
        <div className={styles.leftControls}>
          <button
            onClick={toggleFreeze}
            className={`${styles.btn} ${isFrozen ? styles.btnFreeze_frozen : styles.btnFreeze_live}`}
            aria-label={isFrozen ? 'Unfreeze leaderboard' : 'Freeze leaderboard'}
          >
            {isFrozen ? (
              <>
                <span>🔒 Frozen</span>
              </>
            ) : (
              <>
                <span>🔓 Live</span>
              </>
            )}
          </button>

          {isFrozen && (
            <div className={styles.freezeBanner}>
              <span className={styles.warningIcon}>⚠️</span>
              Rankings locked. Real-time updates queued until unfreeze.
            </div>
          )}
        </div>

        <div className={styles.rightControls}>
          <button
            onClick={handleExportCSV}
            className={`${styles.btn} ${styles.btnExport}`}
            aria-label="Export leaderboard to CSV file"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Leaderboard Grid */}
      <div className={`${styles.tableContainer} glass-panel`} style={{ padding: '8px' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Rank</th>
              <th style={{ width: '45%' }}>Participant Name</th>
              <th style={{ width: '25%', textAlign: 'center' }}>Problems Solved</th>
              <th style={{ width: '15%' }}>Penalty Time</th>
            </tr>
          </thead>
          <tbody>
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No participants on leaderboard.
                </td>
              </tr>
            ) : (
              displayList.map(p => (
                <tr key={p.id} style={{ opacity: p.status === 'Disqualified' ? 0.5 : 1 }}>
                  <td data-label="Rank">
                    <div className={styles.rankCell}>
                      {p.currentRank <= 3 ? (
                        <span className={`${styles.rankBadge} ${getRankBadgeClass(p.currentRank)}`}>
                          {p.currentRank}
                        </span>
                      ) : (
                        <span>#{p.currentRank}</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Name">
                    <div className={styles.participantName}>
                      {p.name}
                      {p.status === 'Disqualified' && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginLeft: 8, fontWeight: 700 }}>
                          [DISQUALIFIED]
                        </span>
                      )}
                    </div>
                    <div className={styles.institution}>{p.institution}</div>
                  </td>
                  <td className={styles.problems} style={{ textAlign: 'center' }} data-label="Problems Solved">
                    {p.problemsSolved}
                  </td>
                  <td className={styles.penalty} data-label="Penalty Time">
                    {p.penaltyTime} min
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
