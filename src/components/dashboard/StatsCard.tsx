import styles from './Dashboard.module.css';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  footer?: React.ReactNode;
}

export default function StatsCard({ label, value, icon, footer }: StatsCardProps) {
  return (
    <div className={`${styles.card} glass-panel`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>{label}</span>
        <span className={styles.cardIcon}>{icon}</span>
      </div>
      <div className={styles.cardValue}>{value}</div>
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  );
}
