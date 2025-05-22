import { create } from 'zustand';

interface Variable {
  name: string;
  category: string;
  value: string | number;
  id: string;
}

interface VariableStore {
  categories: { [key: string]: Variable[] };
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const useVariableStore = create<VariableStore>(set => ({
  categories: {
    Sales: [
      { name: 'revenue', category: 'Sales', value: 12000, id: '1' },
      { name: 'expenses', category: 'Sales', value: 5000, id: '2' },
      { name: 'profit', category: 'Sales', value: 'revenue - expenses', id: '3' },
    ],
    Marketing: [
      { name: 'ad_budget', category: 'Marketing', value: 3000, id: '4' },
      { name: 'clicks', category: 'Marketing', value: 150, id: '5' },
    ],
    Operations: [
      { name: 'stock', category: 'Operations', value: 400, id: '6' },
      { name: 'shipments', category: 'Operations', value: '100 + 200', id: '7' },
    ],
  },
  currentCategory: 'Sales',
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
}));

export { useVariableStore, type Variable };

