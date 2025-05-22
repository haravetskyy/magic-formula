import { create } from 'zustand';

interface CategoryStore {
  categories: string[];
  currentCategory: string;
  editingCategory: string | null;
  addCategory: (tempName: string) => void;
  updateCategoryName: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  setEditingCategory: (category: string | null) => void;
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: ['Sales', 'Marketing', 'Operations'],
  currentCategory: 'Sales',
  editingCategory: null,
  addCategory: (tempName: string) =>
    set(state => ({
      categories: [...state.categories, tempName],
      editingCategory: tempName,
    })),
  updateCategoryName: (oldName: string, newName: string) =>
    set(state => {
      if (!state.categories.includes(oldName) || state.categories.includes(newName)) {
        return state;
      }
      return {
        categories: state.categories.map(c => (c === oldName ? newName : c)),
        currentCategory: state.currentCategory === oldName ? newName : state.currentCategory,
        editingCategory: null,
      };
    }),
  deleteCategory: (name: string) =>
    set(state => {
      if (!state.categories.includes(name)) {
        return state;
      }
      return {
        categories: state.categories.filter(c => c !== name),
        currentCategory: state.currentCategory === name ? '' : state.currentCategory,
        editingCategory: null,
      };
    }),
  setEditingCategory: (category: string | null) => set({ editingCategory: category }),
}));
