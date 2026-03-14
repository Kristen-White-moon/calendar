import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { Check, Plus, Trash2 } from 'lucide-react';

export const TodoList: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    addTodo(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="w-80 h-[calc(100vh-100px)] glass-card flex flex-col overflow-hidden animate-fade-in shrink-0 ml-4 shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">待办清单</h2>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加新备忘..."
            className="flex-1 text-sm bg-white border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
          <button 
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar bg-slate-50/30">
        {todos.length === 0 ? (
          <div className="text-sm text-slate-400 text-center py-10 italic">
            暂无待办事项，喝杯茶吧 🍵
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-start gap-3 p-3 rounded-xl border bg-white transition-all group hover:border-slate-300 shadow-sm
                ${todo.completed ? 'opacity-60 border-slate-100' : 'border-slate-200'}`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors mt-0.5
                  ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-slate-400 text-transparent'}`}
              >
                <Check size={12} strokeWidth={3} />
              </button>
              
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
