import { create } from 'zustand';
import { evaluate } from 'mathjs';

interface Variable {
  name: string;
  category: string;
  value?: string | number;
  id: string;
}

interface VariableStore {
  categories: { [key: string]: Variable[] };
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  evaluateFormula: (formula: string) => number | string;
}

const useVariableStore = create<VariableStore>((set, get) => ({
  categories: {
    Sales: [
      { name: 'revenue', category: 'Sales', value: 12000, id: '1' },
      { name: 'expenses', category: 'Sales', value: 5000, id: '2' },
      { name: 'profit', category: 'Sales', value: '#1 - #2', id: '3' },
    ],
    Marketing: [
      { name: 'revenue', category: 'Marketing', value: 3000, id: '4' },
      { name: 'clicks', category: 'Marketing', value: 150, id: '5' },
    ],
    Operations: [
      { name: 'stock', category: 'Operations', value: 400, id: '6' },
      { name: 'shipments', category: 'Operations', value: '100 + 200', id: '7' },
    ],
  },
  currentCategory: 'Sales',
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
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
}));

export { useVariableStore, type Variable };
