import { useState, useEffect } from 'react';
import type { CustomCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

const STORAGE_KEY = 'calendar_categories_data';

export function useCategories() {
  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string, color: string) => {
    const newCategory: CustomCategory = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory.id;
  };

  const deleteCategory = (id: string) => {
    // Avoid deleting if it's the last category? Maybe just let them.
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const getCategoryTheme = (id: string) => categories.find((c) => c.id === id) || DEFAULT_CATEGORIES[0];

  return { categories, addCategory, deleteCategory, getCategoryTheme };
}
