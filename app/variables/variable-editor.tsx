'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { useVariableStore } from '@/store/variables';
import { TableCell } from '@/components/ui/table';

interface VariableEditorProps {
  variable: { id: string; name: string; value: string | number; category: string };
  isNew: boolean;
  onSave: () => void;
  onCancel: () => void;
}

interface State {
  name: string;
  value: string;
  editingField: 'name' | 'value' | null;
  originalName: string;
}

type Action =
  | { type: 'START_EDIT_NAME' }
  | { type: 'START_EDIT_VALUE' }
  | { type: 'UPDATE_NAME'; name: string }
  | { type: 'UPDATE_VALUE'; value: string }
  | { type: 'COMMIT_NAME' }
  | { type: 'COMMIT_VALUE' }
  | { type: 'CANCEL' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'START_EDIT_NAME':
      return { ...state, editingField: 'name' };
    case 'START_EDIT_VALUE':
      return { ...state, editingField: 'value' };
    case 'UPDATE_NAME':
      return { ...state, name: action.name };
    case 'UPDATE_VALUE':
      return { ...state, value: action.value };
    case 'COMMIT_NAME':
      return { ...state, editingField: state.name.trim() ? 'value' : null };
    case 'COMMIT_VALUE':
      return { ...state, editingField: null };
    case 'CANCEL':
      return { ...state, editingField: null, name: state.originalName };
    default:
      return state;
  }
};

const VariableEditor = ({ variable, isNew, onSave, onCancel }: VariableEditorProps) => {
  const { updateVariable, deleteVariable } = useVariableStore();
  const [state, dispatch] = React.useReducer(reducer, {
    name: isNew ? '' : variable.name,
    value: isNew ? '' : variable.value.toString(),
    editingField: isNew ? 'name' : null,
    originalName: isNew ? '' : variable.name,
  });
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const valueInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state.editingField === 'name' && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (state.editingField === 'value' && valueInputRef.current) {
      valueInputRef.current.focus();
    }
  }, [state.editingField]);

  const handleEditName = () => {
    dispatch({ type: 'START_EDIT_NAME' });
  };

  const handleEditValue = () => {
    dispatch({ type: 'START_EDIT_VALUE' });
  };

  const handleCommitName = () => {
    if (!state.name.trim()) {
      if (isNew) {
        deleteVariable(variable.id);
        onCancel();
      } else {
        dispatch({ type: 'CANCEL' });
      }
      return;
    }
    updateVariable(variable.id, state.name.trim(), state.value);
    dispatch({ type: 'COMMIT_NAME' });
  };

  const handleCommitValue = () => {
    const finalName = state.name.trim() || state.originalName;
    if (!finalName) {
      if (isNew) {
        deleteVariable(variable.id);
      }
      onCancel();
      return;
    }
    updateVariable(variable.id, finalName, state.value || '');
    onSave();
    dispatch({ type: 'COMMIT_VALUE' });
  };

  const handleCancel = () => {
    if (isNew && !state.name.trim()) {
      deleteVariable(variable.id);
    }
    dispatch({ type: 'CANCEL' });
    onCancel();
  };

  return (
    <>
      <TableCell className="w-[33%] border-r">
        {state.editingField === 'name' ? (
          <Input
            ref={nameInputRef}
            value={state.name}
            onChange={e => dispatch({ type: 'UPDATE_NAME', name: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommitName();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onBlur={handleCommitName}
            className="h-8"
          />
        ) : (
          <span className="cursor-pointer hover:underline" onClick={handleEditName}>
            {state.name || 'Untitled'}
          </span>
        )}
      </TableCell>
      <TableCell className="w-[67%]">
        {state.editingField === 'value' ? (
          <Input
            ref={valueInputRef}
            value={state.value}
            onChange={e => dispatch({ type: 'UPDATE_VALUE', value: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommitValue();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onBlur={handleCommitValue}
            className="h-8"
          />
        ) : (
          <span className="cursor-pointer hover:underline" onClick={handleEditValue}>
            {variable.value.toString().startsWith('=')
              ? useVariableStore.getState().evaluateFormula(variable.value.toString())
              : variable.value || 'Not set'}
          </span>
        )}
      </TableCell>
    </>
  );
};

export { VariableEditor };
