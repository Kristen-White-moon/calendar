// src/types.ts

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

export interface ScheduleEvent {
  id: string; // Unique identifier (e.g., UUID or timestamp)
  title?: string; // Optional short title for the event
  notes: string; // The selected remarks/notes content
  categoryId: string; // Changed from category to categoryId
  startTime: string; // ISO String format or Date
  endTime: string; // ISO String format or Date
  dayIndex: number; // 0 (Sunday) to 6 (Saturday) relative to the current week
  weekKey: string; // The ISO date of the Monday of this week, e.g. "2023-10-23"
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Default categories for new users and migration
export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'sleep', name: '睡觉', color: '#c7d2fe' },
  { id: 'work', name: '工作', color: '#fed7aa' },
  { id: 'leisure', name: '娱乐', color: '#bbf7d0' },
  { id: 'other', name: '其他', color: '#e5e7eb' },
];
