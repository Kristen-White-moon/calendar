// src/components/DailyStats.tsx
import React from 'react';
import type { ScheduleEvent, CustomCategory } from '../types';

interface DailyStatsProps {
  events: ScheduleEvent[];
  dayIndex: number;
  categories: CustomCategory[];
}

export const DailyStats: React.FC<DailyStatsProps> = ({ events, dayIndex, categories }) => {
  const dayEvents = events.filter((e) => e.dayIndex === dayIndex);

  // Calculate durations for each category dynamically
  const stats: Record<string, number> = {};
  categories.forEach(c => stats[c.id] = 0);

  dayEvents.forEach((ev) => {
    // Parse time strings "HH:MM"
    const [startH, startM] = ev.startTime.split(':').map(Number);
    const [endH, endM] = ev.endTime.split(':').map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    // Handle events that cross midnight (end time < start time)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const durationHours = (endMinutes - startMinutes) / 60;
    
    if (stats[ev.categoryId] !== undefined) {
      stats[ev.categoryId] += durationHours;
    } else {
      stats[ev.categoryId] = durationHours;
    }
  });

  const totalDuration = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="h-full flex flex-col p-2 space-y-1 overflow-y-auto hide-scrollbar bg-slate-50/50 border-t border-slate-100">
      <div className="text-xs font-semibold text-slate-500 mb-1 flex justify-between items-center">
        <span>统计 (h)</span>
        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
          {totalDuration.toFixed(1)} 总计
        </span>
      </div>
      {categories.map(
        (cat) =>
          stats[cat.id] > 0 && (
            <div key={cat.id} className="flex justify-between items-center text-xs bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-600">{cat.name}</span>
              </div>
              <span className="font-medium text-slate-800">{stats[cat.id].toFixed(1)}</span>
            </div>
          )
      )}
      {totalDuration === 0 && (
        <div className="text-xs text-slate-400 text-center py-2 italic flex-1 flex items-center justify-center">
          暂无日程
        </div>
      )}
    </div>
  );
};
