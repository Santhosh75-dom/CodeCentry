import { useEffect, useState } from 'react';
import { useParticipantStore } from '../../stores';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Participants.module.css';

export default function FilterPanel() {
  const { participants, filters, setFilters } = useParticipantStore();
  const [search, setSearch] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(search, 300);

  // Sync debounced search to store
  useEffect(() => {
    setFilters({ searchTerm: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Sync state if store filter changes (e.g., reset)
  useEffect(() => {
    setSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  // Extract unique institutions
  const institutions = ['All', ...Array.from(new Set(participants.map(p => p.institution)))].sort();

  return (
    <div className={`${styles.filterPanel} glass-panel`}>
      {/* Search Input */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="search-participant">Search Participant</label>
        <input
          id="search-participant"
          type="text"
          className={styles.input}
          placeholder="Type participant name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Institution Dropdown */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="select-institution">Institution</label>
        <select
          id="select-institution"
          className={styles.select}
          value={filters.selectedInstitution}
          onChange={(e) => setFilters({ selectedInstitution: e.target.value })}
        >
          {institutions.map(inst => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
      </div>

      {/* Rank Range */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Rank Range</label>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.input}
            placeholder="Min"
            min="1"
            value={filters.minRank}
            aria-label="Minimum Rank"
            onChange={(e) => setFilters({ minRank: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            className={styles.input}
            placeholder="Max"
            min="1"
            value={filters.maxRank}
            aria-label="Maximum Rank"
            onChange={(e) => setFilters({ maxRank: e.target.value === '' ? '' : Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Problems Solved */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="min-problems">Min Problems Solved</label>
        <input
          id="min-problems"
          type="number"
          className={styles.input}
          placeholder="e.g. 3"
          min="0"
          value={filters.minProblemsSolved}
          onChange={(e) => setFilters({ minProblemsSolved: e.target.value === '' ? '' : Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
