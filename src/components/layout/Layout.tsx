import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '../../stores';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
