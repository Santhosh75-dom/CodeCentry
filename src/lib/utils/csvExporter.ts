import { Participant } from '../types';

export function exportLeaderboardToCSV(participants: Participant[]) {
  // Define CSV headers
  const headers = ['Rank', 'Name', 'Institution', 'Problems Solved', 'Penalty Time (minutes)'];
  
  // Format rows
  const rows = participants.map(p => [
    p.currentRank,
    `"${p.name.replace(/"/g, '""')}"`, // escape quotes in name
    `"${p.institution.replace(/"/g, '""')}"`, // escape quotes in institution
    p.problemsSolved,
    p.penaltyTime
  ]);

  // Combine into single string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create file blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Generate filename with timestamp
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `leaderboard_export_${timestamp}.csv`;

  // Create temporary link element and trigger click
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
