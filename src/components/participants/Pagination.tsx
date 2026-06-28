import styles from './Participants.module.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalItems} participants total)
      </div>

      <div className={styles.pageControls}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
          aria-label="Previous Page"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
