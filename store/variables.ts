import { create } from 'zustand';
import { evaluate } from 'mathjs';

export interface Variable {
  name: string;
  category: string;
  value?: string | number;
  id: string;
}

interface VariableStore {
  categories: { [key: string]: Variable[] };
  currentCategory: string;
  editingCategory: string | null;
  evaluateFormula: (formula: string) => number | string;
  addCategory: (tempName: string) => void;
  updateCategoryName: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  setEditingCategory: (category: string | null) => void;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  categories: {
    Sales: [
      { name: 'revenue', category: 'Sales', value: 12000, id: '1' },
      { name: 'expenses', category: 'Sales', value: 5000, id: '2' },
      { name: 'profit', category: 'Sales', value: '#1 - #2', id: '3' },
    ],
    Marketing: [
      { name: 'revenue', category: 'Marketing', value: 3000, id: '4' },
      { name: 'clicks', category: 'Marketing', id: '5' },
    ],
    Operations: [
      { name: 'stock', category: 'Operations', value: 400, id: '6' },
      { name: 'shipments', category: 'Operations', value: '100 + 200', id: '7' },
    ],
  },
  currentCategory: 'Sales',
  editingCategory: null,
  evaluateFormula: (formula: string) => {
    const allVariables = Object.values(get().categories).flat();

    const variableMap = new Map<string, Variable>();
    allVariables.forEach(variable => {
      variableMap.set(variable.id, variable);
    });

    const resolveValue = (value: string | number): number => {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        try {
          const resolvedFormula = resolveFormula(value);

          return Number(evaluate(resolvedFormula));
        } catch {
          return NaN;
        }
      }
      return NaN;
    };

    const resolveFormula = (formula: string): string => {
      return formula.replace(/#(\w+)/g, (match, id) => {
        const variable = variableMap.get(id);
        if (!variable) {
          return match;
        }
        const resolvedValue = resolveValue(variable.value);

        return isNaN(resolvedValue) ? '0' : resolvedValue.toString();
      });
    };

    const resolvedFormula = resolveFormula(formula);
    return evaluate(resolvedFormula);
  },
  addCategory: (tempName: string) =>
    set(state => ({
      categories: {
        ...state.categories,
        [tempName]: [],
      },

      editingCategory: tempName,
    })),
  updateCategoryName: (oldName: string, newName: string) =>
    set(state => {
      if (!state.categories[oldName] || state.categories[newName]) {
        return state;
      }

      const newCategories = { ...state.categories };

      newCategories[newName] = newCategories[oldName].map(variable => ({
        ...variable,
        category: newName,
      }));

      delete newCategories[oldName];

      return {
        categories: newCategories,
        currentCategory: state.currentCategory === oldName ? newName : state.currentCategory,
        editingCategory: null,
      };
    }),
  deleteCategory: (name: string) =>
    set(state => {
      if (!state.categories[name]) {
        return state;
      }

      const newCategories = { ...state.categories };

      delete newCategories[name];

      return {
        categories: newCategories,
        currentCategory: state.currentCategory === name ? '' : state.currentCategory,
        editingCategory: null,
      };
    }),
  setEditingCategory: (category: string | null) => set({ editingCategory: category }),
}));
