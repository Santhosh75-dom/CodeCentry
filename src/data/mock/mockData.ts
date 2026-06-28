import { Participant, Submission, SubmissionVerdict } from '../../lib/types';

// Simple LCG Seeded Random Generator for deterministic generation
function createRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = createRandom(42); // fixed seed for deterministic mock data

const institutions = [
  'VIT Chennai',
  'IIT Madras',
  'BITS Pilani',
  'NIT Trichy',
  'PSG Tech',
  'SRM University',
  'Anna University',
  'RV College of Engineering',
  'COEP Pune',
  'IIIT Hyderabad'
];

const firstNames = [
  'Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Pranav',
  'Ananya', 'Diya', 'Priya', 'Saanvi', 'Riya', 'Aanya', 'Kavya', 'Aditi', 'Ishita', 'Sneha',
  'Amit', 'Rahul', 'Rohit', 'Siddharth', 'Varun', 'Vikram', 'Deepak', 'Manish', 'Sanjay', 'Alok',
  'Neha', 'Tanvi', 'Anjali', 'Meera', 'Pooja', 'Kirti', 'Rohan', 'Abhishek', 'Karan', 'Dev'
];

const lastNames = [
  'Patel', 'Sharma', 'Verma', 'Singh', 'Gupta', 'Kumar', 'Reddy', 'Nair', 'Iyer', 'Joshi',
  'Mehta', 'Rao', 'Choudhury', 'Sen', 'Das', 'Bannerjee', 'Mishra', 'Pandey', 'Pillai', 'Naidu',
  'Bose', 'Deshmukh', 'Kulkarni', 'Shah', 'Trivedi', 'Bhat', 'Shetty', 'Menon', 'Prasad', 'Saxena'
];

export interface MockProblem {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const mockProblems: MockProblem[] = [
  { id: 'A', name: 'Chef and Array', difficulty: 'Easy' },
  { id: 'B', name: 'Maximum Sum Path', difficulty: 'Easy' },
  { id: 'C', name: 'Subarray Queries', difficulty: 'Medium' },
  { id: 'D', name: 'Tree Graph Coloring', difficulty: 'Medium' },
  { id: 'E', name: 'String Palindrome K', difficulty: 'Medium' },
  { id: 'F', name: 'Matrix Rotation Query', difficulty: 'Medium' },
  { id: 'G', name: 'Chef and Segments', difficulty: 'Medium' },
  { id: 'H', name: 'xor Tree Queries', difficulty: 'Hard' },
  { id: 'I', name: 'Minimum Cost Edge', difficulty: 'Hard' },
  { id: 'J', name: 'Divide and Conquer Game', difficulty: 'Hard' },
];

const languages = ['C++', 'Python 3', 'Java', 'PyPy 3', 'Go', 'Rust'];

// Helper to format minutes into HH:MM:SS
export function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateData() {
  const participants: Participant[] = [];
  
  // 1. Generate 150 participants
  for (let i = 1; i <= 150; i++) {
    const fIdx = Math.floor(random() * firstNames.length);
    const lIdx = Math.floor(random() * lastNames.length);
    const instIdx = Math.floor(random() * institutions.length);
    const name = `${firstNames[fIdx]} ${lastNames[lIdx]}`;
    
    // Status distribution: 95% Active, 3% Inactive, 2% Disqualified
    const randStatus = random();
    let status: Participant['status'] = 'Active';
    if (randStatus > 0.98) status = 'Disqualified';
    else if (randStatus > 0.95) status = 'Inactive';
    
    participants.push({
      id: `p-${i}`,
      name,
      institution: institutions[instIdx],
      currentRank: 0, // calculated later
      problemsSolved: 0, // calculated later
      penaltyTime: 0, // calculated later
      status,
    });
  }

  // 2. Generate 550 submissions during a 5-hour contest (18000 seconds)
  const submissions: Submission[] = [];
  const contestDurationSeconds = 5 * 60 * 60;

  for (let i = 1; i <= 550; i++) {
    const subTimeSec = Math.floor(random() * contestDurationSeconds);
    const partIdx = Math.floor(random() * participants.length);
    const probIdx = Math.floor(random() * mockProblems.length);
    const langIdx = Math.floor(random() * languages.length);
    
    const participant = participants[partIdx];
    const problem = mockProblems[probIdx];
    
    // Determine verdict with weighted random distribution
    let verdict: SubmissionVerdict = 'Wrong Answer';
    const randVerdict = random();
    if (randVerdict < 0.65) {
      verdict = 'Accepted';
    } else if (randVerdict < 0.85) {
      verdict = 'Wrong Answer';
    } else if (randVerdict < 0.93) {
      verdict = 'Time Limit Exceeded';
    } else {
      verdict = 'Runtime Error';
    }

    submissions.push({
      id: `sub-${i}`,
      participantId: participant.id,
      participantName: participant.name,
      problemId: problem.id,
      problemName: problem.name,
      submissionTime: formatDuration(subTimeSec),
      verdict,
      language: languages[langIdx]
    });
  }

  // Sort submissions chronologically
  submissions.sort((a, b) => a.submissionTime.localeCompare(b.submissionTime));

  // Re-id after sorting to maintain reverse chronological/chronological visual order
  submissions.forEach((sub, idx) => {
    sub.id = `sub-${idx + 1}`;
  });

  // 3. Compute problemsSolved and penaltyTime for each participant
  participants.forEach(p => {
    // Get all submissions for this participant
    const pSubmissions = submissions.filter(s => s.participantId === p.id);
    
    // Sort participant submissions by time
    pSubmissions.sort((a, b) => a.submissionTime.localeCompare(b.submissionTime));

    let solvedCount = 0;
    let totalPenalty = 0;
    const solvedProblems = new Set<string>();

    // Track failed submissions per problem before solving
    const failedCounts: Record<string, number> = {};

    pSubmissions.forEach(sub => {
      if (solvedProblems.has(sub.problemId)) {
        // Already solved, subsequent submissions don't affect scoring
        return;
      }

      if (sub.verdict === 'Accepted') {
        solvedProblems.add(sub.problemId);
        solvedCount++;
        
        // Parse submission time to minutes
        const [h, m] = sub.submissionTime.split(':').map(Number);
        const subMinutes = h * 60 + m;
        
        // Penalty = minutes since start + 20 min for each failed attempt before AC
        const failedBefore = failedCounts[sub.problemId] || 0;
        totalPenalty += subMinutes + failedBefore * 20;
      } else {
        // Non-AC submissions count as penalty if solved eventually
        failedCounts[sub.problemId] = (failedCounts[sub.problemId] || 0) + 1;
      }
    });

    p.problemsSolved = solvedCount;
    p.penaltyTime = totalPenalty;
  });

  // 4. Calculate initial rankings using primary and secondary sort
  participants.sort((a, b) => {
    if (a.status === 'Disqualified' && b.status !== 'Disqualified') return 1;
    if (b.status === 'Disqualified' && a.status !== 'Disqualified') return -1;
    
    if (a.problemsSolved !== b.problemsSolved) {
      return b.problemsSolved - a.problemsSolved; // descending
    }
    return a.penaltyTime - b.penaltyTime; // ascending
  });

  participants.forEach((p, idx) => {
    p.currentRank = idx + 1;
  });

  // Return generated mock database
  return {
    participants,
    submissions,
    problems: mockProblems
  };
}

const mockData = generateData();
export default mockData;
export const initialParticipants = mockData.participants;
export const initialSubmissions = mockData.submissions;
