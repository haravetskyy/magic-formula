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
  deleteVariablesByCategory: (category: string) => void;
  evaluateFormula: (formula: string) => number | string;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  variables: [],
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
  deleteVariablesByCategory: category =>
    set(state => ({
      variables: state.variables.filter(v => v.category !== category),
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

