import { useUIStore } from '../../stores';
import ThemeToggle from './ThemeToggle';
import styles from './Layout.module.css';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={styles.menuButton}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: 24, height: 24 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: 24, height: 24 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: 24, height: 24 }}
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6zm4.5 7.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75zM9 16.5a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9zm.75-9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          CodeChef CCC
          <span className={styles.logoSub}>VIT Chennai</span>
        </div>
      </div>

      <div className={styles.headerRight}>
        <ThemeToggle />
      </div>
    </header>
  );
}
