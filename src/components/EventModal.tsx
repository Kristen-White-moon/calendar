// src/components/EventModal.tsx
import React, { useState, useEffect } from 'react';
import type { ScheduleEvent, CustomCategory } from '../types';
import { X, Plus } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<ScheduleEvent, 'id' | 'weekKey'>) => void;
  onDelete?: (id: string) => void;
  initialData?: Partial<ScheduleEvent> | ScheduleEvent;
  categories: CustomCategory[];
  onAddCategory: (name: string, color: string) => string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  categories,
  onAddCategory,
}) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [dayIndex, setDayIndex] = useState(0);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#e2e8f0');

  useEffect(() => {
    if (isOpen) {
      if (initialData && 'categoryId' in initialData) {
         setCategoryId(initialData.categoryId || categories[0]?.id || '');
      } else {
         setCategoryId(categories[0]?.id || '');
      }
      setStartTime(initialData?.startTime || '09:00');
      setEndTime(initialData?.endTime || '10:00');
      setNotes(initialData?.notes || '');
      setDayIndex(initialData?.dayIndex ?? 0);
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  }, [isOpen, initialData, categories]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      categoryId,
      startTime,
      endTime,
      notes,
      dayIndex,
    });
    onClose();
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    const newId = onAddCategory(newCategoryName.trim(), newCategoryColor);
    setCategoryId(newId);
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-slate-800">
          {initialData && 'id' in initialData ? '编辑日程' : '添加日程'}
        </h2>

        <div className="space-y-4">
          {/* 分类选择 */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="text-sm font-medium text-slate-600">类型</label>
               {!isAddingCategory && (
                 <button 
                   onClick={() => setIsAddingCategory(true)}
                   className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                 >
                   <Plus size={14} /> 新建分类
                 </button>
               )}
            </div>
            
            {isAddingCategory ? (
               <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200 animate-fade-in">
                  <div className="relative flex items-center">
                    <input 
                      type="color" 
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden border-0 p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="分类名称..."
                    className="flex-1 text-sm border-slate-300 py-1.5"
                    autoFocus
                  />
                  <button onClick={handleAddNewCategory} disabled={!newCategoryName.trim()} className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors">保存</button>
                  <button onClick={() => setIsAddingCategory(false)} className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">取消</button>
               </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategoryId(c.id)}
                      className={`py-1.5 px-3 rounded-lg text-sm transition-all border ${
                        categoryId === c.id
                          ? `shadow-sm font-medium text-slate-800`
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                      style={{ 
                        backgroundColor: categoryId === c.id ? c.color : 'transparent',
                        borderColor: categoryId === c.id ? c.color : ''
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryId !== c.id ? c.color : 'rgba(0,0,0,0.2)' }}></div>
                        {c.name}
                      </div>
                    </button>
                  ))}
                </div>
            )}
          </div>

          {/* 时间段 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-2">开始时间</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border-slate-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-2">结束时间</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border-slate-200"
              />
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">备注 (可选)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-slate-200"
              rows={3}
              placeholder="例如：完成项目A的汇报PPT..."
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-end items-center">
          {initialData && 'id' in initialData && onDelete && (
             <button
               onClick={() => {
                 onDelete((initialData as ScheduleEvent).id);
                 onClose();
               }}
               className="mr-auto text-sm text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
             >
               删除
             </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
