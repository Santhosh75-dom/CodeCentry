import { useEffect, useState } from 'react';
import { useSubmissionStore } from '../../stores';
import { useDebounce } from '../../hooks/useDebounce';
import { mockProblems } from '../../data/mock/mockData';
import styles from './Submissions.module.css';

export default function SubmissionFilters() {
  const { filters, setFilters } = useSubmissionStore();
  const [search, setSearch] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(search, 300);

  // Sync debounced search to store
  useEffect(() => {
    setFilters({ searchTerm: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Sync search if store is reset
  useEffect(() => {
    setSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  const verdicts = [
    'All',
    'Accepted',
    'Wrong Answer',
    'Time Limit Exceeded',
    'Runtime Error',
    'Pending',
    'Running'
  ];

  return (
    <div className={`${styles.filterPanel} glass-panel`}>
      {/* Search Input */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="search-participant">Search Participant</label>
        <input
          id="search-participant"
          type="text"
          className={styles.input}
          placeholder="Search by participant name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Verdict Dropdown */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="select-verdict">Verdict</label>
        <select
          id="select-verdict"
          className={styles.select}
          value={filters.verdict}
          onChange={(e) => setFilters({ verdict: e.target.value })}
        >
          {verdicts.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Problem Dropdown */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="select-problem">Problem</label>
        <select
          id="select-problem"
          className={styles.select}
          value={filters.problemId}
          onChange={(e) => setFilters({ problemId: e.target.value })}
        >
          <option value="All">All Problems</option>
          {mockProblems.map(p => (
            <option key={p.id} value={p.id}>
              Problem {p.id} - {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
