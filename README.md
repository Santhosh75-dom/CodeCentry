# CodeChef Contest Control Center

A modern, high-end, responsive real-time contest monitoring dashboard for contest organizers. The application is built using Next.js, TypeScript, Zustand for state management, and CSS Modules (Mobile-first responsive styling).

## Tech Stack
- **Core**: Next.js 14 (Pages Router)
- **Language**: TypeScript 5
- **State Management**: Zustand 4.4
- **Styling**: Vanilla CSS Modules (no Tailwind CSS, custom dark-by-default HSL theme)
- **Real-time Engine**: Simulated Background grading engine

---

## Folder Structure
```
src/
├── components/          # Presentational UI components
│   ├── layout/          # Layout, Header, Sidebar, ThemeToggle
│   ├── dashboard/       # StatsCard, Overview, Countdown, ActivityFeed
│   ├── participants/    # FilterPanel, Table, Pagination
│   ├── submissions/     # VerdictBadge, Table, Filters, RejudgeModal
│   └── leaderboard/     # Table, Freeze controls
├── data/
│   └── mock/            # mockData.ts (Seeded deterministic generator)
├── hooks/               # useContestTimer, useDebounce, useSubmissionSimulator
├── lib/
│   ├── engines/         # pure business logic engines (ranking, filters)
│   ├── types/           # TS definitions
│   └── utils/           # csvExporter.ts
├── pages/               # Routes mapped to views
│   ├── index.tsx        # Overview Dashboard
│   ├── participants.tsx # Participant management
│   ├── submissions.tsx  # Submission log monitoring
│   └── leaderboard.tsx  # Standings table & Freeze/CSV exports
└── styles/
    └── globals.css      # Core variables and styles
```

---

## Architectural Principles

### 1. Separation of Concerns
1. **Presentational Layer**: React components are only responsible for rendering UI based on store subscription values.
2. **State Store Layer (Zustand)**: Coordinate actions, handle updates, and orchestrate cascades.
3. **Logic Layer (Pure Functions)**: Calculations like CP rankings sorting (`rankingEngine.ts`) and filtration queries (`filterEngine.ts`) are decoupled into pure testable functions.

### 2. Multi-Store State Synchronization
State is divided into 5 independent stores:
- `contestStore`: Contest timer, countdown, and active statistics.
- `participantStore`: Participant scoring data, sorting criteria, page tracking.
- `submissionStore`: Core logs and rejudging handles.
- `uiStore`: Tab routing, sidebar toggle, dark/light theme, and leaderboard freeze snapshot.
- `activityStore`: Timeline events.

Store actions communicate using `getState()` where appropriate to coordinate complex cascading updates (such as updating a submission verdict leading to scoring recomputations, rank updates, and activity logging).

---

## Key Features

### 1. Live Contest Countdown Timer
The countdown ticks down every second. Administrators can simulate ending or starting the contest using the control panel button.

### 2. Live Submission Simulation
A background grading simulator runs every 15 seconds. It submits a solution under a random participant as "Running" (colored blue), then resolves it after 2.5 seconds to a graded verdict (Accepted, Wrong Answer, etc.), mimicking a real contest feed.

### 3. Rejudge Cascades
Clicking on any submission's verdict badge opens a modal. Changing the verdict triggers a cascading transaction:
- Updates submission verdict in `submissionStore`.
- Recalculates participant's problems solved and penalty time in `participantStore` from scratch.
- Recalculates rankings (if not in freeze mode).
- Logs the rejudge event in the Activity Feed.

### 4. Leaderboard Freeze Mode
Toggling Freeze locks the stands visuals. Real-time submissions continue to be logged and participant points continue to update internally, but the Standings display remains locked to the freeze snapshot. Unfreezing calculates rankings once with all accumulated data and updates standings.

### 5. Multi-level Participant Filtering
Combines Name search (debounced at 300ms), Institution filter, Rank range (min/max), and minimum Problems Solved filters with strict AND logic.

### 6. CSV Standings Export
Instantly downloads the standings as a formatted CSV file with a detailed timestamp in the filename.

### 7. Mobile-First Card Tables
Uses CSS Media queries to transform tabular views into beautiful card listings on small mobile screens.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository and navigate inside:
   ```bash
   cd CodeCentry
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) on your browser.

---

## Validation & Verification

### Build Check
Run the production build tool to check for TypeScript and routing correctness:
```bash
npm run build
```
