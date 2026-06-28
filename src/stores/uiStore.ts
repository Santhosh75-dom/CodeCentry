import { create } from 'zustand';
import { Participant } from '../lib/types';
import { useParticipantStore } from './participantStore';
import { useActivityStore } from './activityStore';

type TabType = 'overview' | 'participants' | 'submissions' | 'leaderboard';

interface UIState {
  theme: 'light' | 'dark';
  activeTab: TabType;
  sidebarOpen: boolean;
  isFrozen: boolean;
  frozenSnapshot: Participant[];
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveTab: (tab: TabType) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleFreeze: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark', // default theme
  activeTab: 'overview',
  sidebarOpen: false,
  isFrozen: false,
  frozenSnapshot: [],

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: nextTheme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  setActiveTab: (activeTab) => set({ activeTab, sidebarOpen: false }),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  toggleFreeze: () => {
    const nextFrozen = !get().isFrozen;
    
    if (nextFrozen) {
      // Freeze: Store snapshot of current ranked participants
      const rankedParticipants = useParticipantStore.getState().rankedParticipants;
      set({ 
        isFrozen: true,
        frozenSnapshot: JSON.parse(JSON.stringify(rankedParticipants))
      });
      // Log activity
      useActivityStore.getState().logActivity('frozen', 'Leaderboard was frozen by administrator.');
    } else {
      // Unfreeze: Clear snapshot and recalculate rankings in participant store
      set({ 
        isFrozen: false,
        frozenSnapshot: []
      });
      
      // Recalculate ranks in participant store
      useParticipantStore.getState().recalculateRankings();

      // Log activity
      useActivityStore.getState().logActivity('unfrozen', 'Leaderboard was unfrozen by administrator. Rankings recalculated.');
    }
  }
}));
