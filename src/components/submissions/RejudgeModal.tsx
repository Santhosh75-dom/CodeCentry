import { useState, useEffect } from 'react';
import { Submission, SubmissionVerdict } from '../../lib/types';
import { useSubmissionStore } from '../../stores';
import VerdictBadge from './VerdictBadge';
import styles from './Submissions.module.css';

interface RejudgeModalProps {
  isOpen: boolean;
  submission: Submission | null;
  onClose: () => void;
}

export default function RejudgeModal({ isOpen, submission, onClose }: RejudgeModalProps) {
  const { updateSubmissionVerdict } = useSubmissionStore();
  const [selectedVerdict, setSelectedVerdict] = useState<SubmissionVerdict>('Pending');

  // Sync selected verdict with current submission verdict on load
  useEffect(() => {
    if (submission) {
      setSelectedVerdict(submission.verdict);
    }
  }, [submission]);

  // Handle escape key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !submission) return null;

  const verdicts: SubmissionVerdict[] = [
    'Pending',
    'Running',
    'Accepted',
    'Wrong Answer',
    'Time Limit Exceeded',
    'Runtime Error'
  ];

  const handleConfirm = () => {
    updateSubmissionVerdict(submission.id, selectedVerdict);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} glass-panel`} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Rejudge Submission</h2>

        <div className={styles.modalDetails}>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>Submission ID:</span>
            <span className={styles.modalDetailValue}>{submission.id}</span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>Participant:</span>
            <span className={styles.modalDetailValue}>{submission.participantName}</span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>Problem:</span>
            <span className={styles.modalDetailValue}>
              {submission.problemId} - {submission.problemName}
            </span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>Current Verdict:</span>
            <span>
              <VerdictBadge verdict={submission.verdict} />
            </span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="select-new-verdict">Select New Verdict</label>
          <select
            id="select-new-verdict"
            className={styles.select}
            value={selectedVerdict}
            onChange={(e) => setSelectedVerdict(e.target.value as SubmissionVerdict)}
          >
            {verdicts.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={`${styles.btn} styles.btnCancel ${styles.btnCancel}`}>
            Cancel
          </button>
          <button onClick={handleConfirm} className={`${styles.btn} styles.btnConfirm ${styles.btnConfirm}`}>
            Confirm Rejudge
          </button>
        </div>
      </div>
    </div>
  );
}
