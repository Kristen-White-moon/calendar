// src/components/WeeklyCalendar.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ScheduleEvent, CustomCategory } from '../types';
import { DailyStats } from './DailyStats';

interface WeeklyCalendarProps {
  events: ScheduleEvent[];
  onAddEvent: (startTime: string, endTime: string, dayIndex: number) => void;
  onEditEvent: (event: ScheduleEvent) => void;
  currentDate: Date; // A date in the week to determine the actual dates
  weekKey: string; // The current week key
  categories: CustomCategory[];
  getCategoryTheme: (id: string) => CustomCategory;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface Selection {
  dayIndex: number;
  startHour: number;
  endHour: number;
}

// Convert "HH:MM" to decimal hours (e.g., "09:30" -> 9.5)
const timeToDecimal = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
};

// Convert decimal hours to "HH:MM" format
const decimalToTime = (decimal: number) => {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  currentDate,
  weekKey,
  categories,
  getCategoryTheme,
}) => {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate date labels for the current week
  const getWeekDates = () => {
    const dates = [];
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(curr.getFullYear(), curr.getMonth(), first + i);
        dates.push(nextDate.getDate());
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Handle drag selection
  const handlePointerDown = (e: React.PointerEvent, dayIndex: number) => {
    if (!gridRef.current) return;
    setIsDragging(true);
    e.currentTarget.releasePointerCapture(e.pointerId); // Allows events to fire on other elements during drag

    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    let hour = y / 48; // var(--hour-height) is 48px
    if (hour < 0) hour = 0;
    if (hour > 24) hour = 24;

    // Snap to nearest 30 mins (0.5 hours)
    hour = Math.floor(hour * 2) / 2;

    setSelection({
      dayIndex,
      startHour: hour,
      endHour: hour + 0.5, // minimum 30 min block
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selection || !gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    let y = e.clientY - gridRect.top;
    let hour = y / 48;
    
    // Boundary checks
    if (hour < 0) hour = 0;
    if (hour > 24) hour = 24;

    // Snap to nearest 30 mins
    hour = Math.round(hour * 2) / 2;

    setSelection((prev) => {
      if (!prev) return null;
      // We allow dragging up or down, but endHour must be >= startHour + 0.5
      let start = Math.min(prev.startHour, hour);
      let end = Math.max(prev.startHour, hour);
      
      // Ensure min 30 min duration
      if (end === start) end = start + 0.5;

      return {
        ...prev,
        startHour: prev.startHour, // Keep original start point
        endHour: hour,
      };
    });
  };

  const handlePointerUp = () => {
    if (isDragging && selection) {
        // Ensure proper order
        const actualStart = Math.min(selection.startHour, selection.endHour);
        const actualEnd = Math.max(selection.startHour, selection.endHour);
        
        // Ensure min duration 30 mins
        const finalEnd = actualStart === actualEnd ? actualStart + 0.5 : actualEnd;

        onAddEvent(
            decimalToTime(actualStart),
            decimalToTime(finalEnd),
            selection.dayIndex
        );
    }
    setIsDragging(false);
    setSelection(null);
  };

  // Setup global event listeners for drag constraints
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handlePointerUp();
      }
    };
    window.addEventListener('pointerup', handleGlobalMouseUp);
    return () => window.removeEventListener('pointerup', handleGlobalMouseUp);
  }, [isDragging, selection]);


  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Row: Days */}
      <div className="flex border-b border-slate-200 bg-slate-50 relative z-10 shrink-0 select-none">
        <div className="w-[var(--time-col-width)] shrink-0 border-r border-slate-200"></div>
        {DAYS.map((day, i) => (
          <div key={day} className="flex-1 min-w-[var(--day-col-min-width)] border-r border-slate-100 text-center py-3 flex flex-col justify-center">
            <span className="text-xs font-medium text-slate-500">{day}</span>
            <span className="text-xl font-semibold text-slate-800">{weekDates[i]}</span>
          </div>
        ))}
      </div>

      {/* Main Grid Area (Scrollable) */}
      <div 
        className="flex-1 overflow-y-auto relative hidden-scrollbar" 
        ref={scrollRef}
        onPointerMove={handlePointerMove}
      >
        <div className="flex relative min-w-max md:min-w-0" ref={gridRef}>
          {/* Time Column */}
          <div className="w-[var(--time-col-width)] shrink-0 bg-white border-r border-slate-200 sticky left-0 z-20 select-none">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-[var(--hour-height)] border-b border-slate-100 relative group"
              >
                <span className="absolute -top-3 right-2 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {DAYS.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-1 min-w-[var(--day-col-min-width)] border-r border-slate-100 relative bg-white touch-none"
              onPointerDown={(e) => handlePointerDown(e, dayIndex)}
            >
              {/* Grid Lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-[var(--hour-height)] border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                  style={{ pointerEvents: 'none' }} // Let the column handle pointer events
                ></div>
              ))}

              {/* Render Existing Events */}
              {events
                .filter((ev) => ev.dayIndex === dayIndex && ev.weekKey === weekKey)
                .map((ev) => {
                  const startDec = timeToDecimal(ev.startTime);
                  const endDec = timeToDecimal(ev.endTime);
                  
                  // Handle overnight events spanning past midnight
                  const isOvernight = endDec < startDec;
                  const finalEndDec = isOvernight ? 24 : endDec;

                  const top = startDec * 48; // 48px per hour
                  const height = (finalEndDec - startDec) * 48;

                  const theme = getCategoryTheme(ev.categoryId);

                  return (
                    <div
                      key={ev.id}
                      className="absolute left-1 right-1 rounded-lg border shadow-sm p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:z-30 group animate-pop-in"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: theme.color,
                        borderColor: 'rgba(0,0,0,0.05)',
                        zIndex: 10
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                    >
                      <div className="text-xs font-semibold text-slate-800 mb-0.5 truncate">
                         {theme.name}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate opacity-80 group-hover:opacity-100">
                        {ev.startTime} - {isOvernight ? '次日' + ev.endTime : ev.endTime}
                      </div>
                      {ev.notes && (
                        <div className="text-[10px] text-slate-700 mt-1 line-clamp-2 leading-tight">
                          {ev.notes}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Render Active Drag Selection */}
              {isDragging && selection && selection.dayIndex === dayIndex && (
                <div
                  className="absolute left-1 right-1 bg-slate-400/20 border-2 border-slate-400 border-dashed rounded-lg z-20 pointer-events-none transition-all duration-75"
                  style={{
                    top: `${Math.min(selection.startHour, selection.endHour) * 48}px`,
                    height: `${Math.abs(selection.endHour - selection.startHour) * 48}px`,
                  }}
                >
                    <div className="text-[10px] font-medium text-slate-500 bg-white/80 px-1 rounded inline-block m-1 backdrop-blur-sm">
                        {decimalToTime(Math.min(selection.startHour, selection.endHour))} - {decimalToTime(Math.max(selection.startHour, selection.endHour))}
                    </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Row: Daily Stats */}
      <div className="h-[var(--stats-height)] flex border-t border-slate-200 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-20">
         <div className="w-[var(--time-col-width)] shrink-0 border-r border-slate-200 flex items-center justify-center bg-slate-50 text-xs text-slate-500 font-medium">
             统计
         </div>
         {DAYS.map((_, index) => (
             <div key={`stats-${index}`} className="flex-1 min-w-[var(--day-col-min-width)] border-r border-slate-100">
                 <DailyStats events={events.filter(e => e.weekKey === weekKey)} dayIndex={index} categories={categories} />
             </div>
         ))}
      </div>
    </div>
  );
};
