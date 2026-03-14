import { useState } from 'react';
import { useSchedule } from './hooks/useSchedule';
import { useCategories } from './hooks/useCategories';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { EventModal } from './components/EventModal';
import { TodoList } from './components/TodoList';
import type { ScheduleEvent } from './types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { zhCN } from 'date-fns/locale';

function App() {
  const { events, addEvent, updateEvent, deleteEvent } = useSchedule();
  const { categories, addCategory, getCategoryTheme } = useCategories();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Partial<ScheduleEvent> | ScheduleEvent | undefined>();

  // Current Week State
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => setCurrentDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Called when dragging finishes on the grid
  const handleAddEventClick = (startTime: string, endTime: string, dayIndex: number) => {
    setModalData({ startTime, endTime, dayIndex });
    setIsModalOpen(true);
  };

  const handleEditEventClick = (event: ScheduleEvent) => {
    setModalData(event);
    setIsModalOpen(true);
  };

  const handleModalSave = (data: Omit<ScheduleEvent, 'id'>) => {
    if (modalData && 'id' in modalData) {
      updateEvent({ ...data, id: (modalData as ScheduleEvent).id });
    } else {
      addEvent(data);
    }
  };

  return (
    <div className="app-container py-4 flex flex-col h-screen overflow-hidden">
      {/* Header Container */}
      <header className="h-[var(--header-height)] glass-card mb-4 px-6 flex items-center justify-between shrink-0 animate-fade-in shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
             <CalendarIcon size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 tracking-tight">
            日程统计
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleToday}
            className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
          >
            本周
          </button>
          
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={handlePrevWeek}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-700 min-w-[140px] text-center select-none">
              {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
            </span>
            <button 
              onClick={handleNextWeek}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Weekly Calendar */}
        <WeeklyCalendar
          events={events}
          onAddEvent={handleAddEventClick}
          onEditEvent={handleEditEventClick}
          currentDate={currentDate}
          categories={categories}
          getCategoryTheme={getCategoryTheme}
        />

        {/* Right: TODO List */}
        <TodoList />
      </div>

      {/* Event Add/Edit Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        onDelete={deleteEvent}
        initialData={modalData}
        categories={categories}
        onAddCategory={addCategory}
      />
    </div>
  );
}

export default App;
