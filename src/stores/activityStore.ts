import { create } from 'zustand';
import { Activity, ActivityType } from '../lib/types';

interface ActivityState {
  activities: Activity[];
  logActivity: (type: ActivityType, description: string, metadata?: Record<string, unknown>) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [
    {
      id: 'act-init-1',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
      type: 'joined',
      description: 'Contest server initialized with 150 participants.'
    },
    {
      id: 'act-init-2',
      timestamp: new Date().toISOString(),
      type: 'joined',
      description: 'Contest control session started.'
    }
  ],

  logActivity: (type, description, metadata) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      metadata
    };

    set(state => ({
      // Add new activity at the front (reverse chronological order)
      activities: [newActivity, ...state.activities].slice(0, 100)
    }));
  },

  clearActivities: () => set({ activities: [] })
}));
