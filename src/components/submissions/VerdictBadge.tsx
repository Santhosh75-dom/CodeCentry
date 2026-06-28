import { SubmissionVerdict } from '../../lib/types';
import styles from './Submissions.module.css';

interface VerdictBadgeProps {
  verdict: SubmissionVerdict;
}

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  // Convert verdict to style selector (e.g. "Wrong Answer" -> "WrongAnswer")
  const selector = verdict.replace(/\s+/g, '');
  const badgeClass = styles[`verdictBadge_${selector}`] || styles.verdictBadge_Pending;

  return (
    <span className={`${styles.verdictBadge} ${badgeClass}`}>
      {/* Small dot icon representing status */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }}
      />
      {verdict}
    </span>
  );
}
