// src/hooks/useSchedule.ts
import { useState, useEffect } from 'react';
import type { ScheduleEvent } from '../types';

const STORAGE_KEY = 'calendar_events_data';

export function useSchedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent: Omit<ScheduleEvent, 'id'>) => {
    const event: ScheduleEvent = {
        ...newEvent,
        id: crypto.randomUUID()
    };
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (updatedEvent: ScheduleEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return { events, addEvent, updateEvent, deleteEvent, setEvents };
}
