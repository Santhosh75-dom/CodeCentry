import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={styles.navIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      )
    },
    {
      label: 'Participants',
      path: '/participants',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={styles.navIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20a11.386 11.386 0 0 1-4.918-1.109v-.109c0-3.478 2.447-6.326 5.674-6.918m5.674 6.918v-.003c0-1.113-.283-2.16-.784-3.07m-5.674 3.07a11.056 11.056 0 0 1-2.25-.226m6.75-6.77a4.8 4.8 0 0 0-.012-.023c.311-.539.48-1.161.48-1.82 0-2.03-1.65-3.68-3.68-3.68-2.03 0-3.68 1.65-3.68 3.68 0 .659.169 1.281.48 1.82a4.8 4.8 0 0 0-.012.023m7.533 2.493a3.375 3.375 0 1 1-6.158-2.493m6.158 2.493c-.456.811-1.077 1.485-1.786 1.96m6.774-2.28a3.374 3.374 0 1 1-6.158-2.492m6.158 2.492c-.456.811-1.077 1.485-1.786 1.96"
          />
        </svg>
      )
    },
    {
      label: 'Submissions',
      path: '/submissions',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={styles.navIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.375M9 18h3.375m-6.42 2.25H19.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h7.5A.75.75 0 0 1 15 6.75v3.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-3.75A.75.75 0 0 1 6.75 6.75Z"
          />
        </svg>
      )
    },
    {
      label: 'Leaderboard',
      path: '/leaderboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={styles.navIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25a1.125 1.125 0 0 0-1.125 1.125V18.75m9 0-3.375-3.375m-1.5-1.5-1.5-1.5M9 18.75v-6.75c0-.621-.504-1.125-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125v6.75m3.75-6.75-3-3m1.5-1.5L4.5 9m15 0-3-3m1.5-1.5L16.5 6"
          />
        </svg>
      )
    }
  ];

  return (
    <>
      {isOpen && <div className={styles.sidebarOverlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <nav className={styles.sidebarNav}>
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
