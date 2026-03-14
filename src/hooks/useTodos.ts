import { useState, useEffect } from 'react';
import type { TodoItem } from '../types';

const STORAGE_KEY = 'calendar_todos_data';

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: text.trim(), completed: false, createdAt: Date.now() },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}
