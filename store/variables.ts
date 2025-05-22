import { create } from 'zustand';
import { evaluate } from 'mathjs';

export interface Variable {
  name: string;
  category: string;
  value: string | number;
  id: string;
}

interface VariableStore {
  variables: Variable[];
  addVariable: (category: string, name: string, value: string | number, id: string) => void;
  updateVariable: (id: string, name: string, value: string | number) => void;
  deleteVariable: (id: string) => void;
  evaluateFormula: (formula: string) => number | string;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  variables: [
    { name: 'revenue', category: 'Sales', value: 12000, id: '1' },
    { name: 'expenses', category: 'Sales', value: 5000, id: '2' },
    { name: 'profit', category: 'Sales', value: '=#1 - #2', id: '3' },
    { name: 'revenue', category: 'Marketing', value: 3000, id: '4' },
    { name: 'clicks', category: 'Marketing', value: 150, id: '5' },
    { name: 'stock', category: 'Operations', value: 400, id: '6' },
    { name: 'shipments', category: 'Operations', value: '=100 + 200', id: '7' },
  ],
  addVariable: (category, name, value, id) =>
    set(state => ({
      variables: [...state.variables, { name, category, value, id }],
    })),
  updateVariable: (id, name, value) =>
    set(state => {
      if (!name.trim()) {
        return state;
      }
      return {
        variables: state.variables.map(v => (v.id === id ? { ...v, name: name.trim(), value } : v)),
      };
    }),
  deleteVariable: id =>
    set(state => ({
      variables: state.variables.filter(v => v.id !== id),
    })),
  evaluateFormula: (formula: string) => {
    if (!formula.startsWith('=')) {
      return formula;
    }
    try {
      const variables = get().variables;
      const variableMap = new Map<string, Variable>();
      variables.forEach(variable => {
        variableMap.set(variable.id, variable);
      });

      const resolveValue = (value: string | number): number => {
        if (typeof value === 'number') {
          return value;
        }
        if (typeof value === 'string') {
          if (!value.startsWith('=')) {
            return Number(value) || 0;
          }
          try {
            const resolvedFormula = resolveFormula(value.slice(1));
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

      const resolvedFormula = resolveFormula(formula.slice(1));
      return evaluate(resolvedFormula);
    } catch (error) {
      return formula;
    }
  },
}));
