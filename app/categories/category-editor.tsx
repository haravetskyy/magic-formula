'use client';

import React, { useReducer, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useVariableStore } from '@/store/variables';

interface CategoryNameEditorProps {
  category: string;
}

interface State {
  name: string;
  isNewCategory: boolean;
}

type Action =
  | { type: 'START_EDIT'; category: string }
  | { type: 'UPDATE_NAME'; name: string }
  | { type: 'CANCEL'; category: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'START_EDIT':
      return {
        name: action.category.includes('-') ? '' : action.category,
        isNewCategory: action.category.includes('-'),
      };
    case 'UPDATE_NAME':
      return { ...state, name: action.name };
    case 'CANCEL':
      return {
        name: action.category.includes('-') ? '' : action.category,
        isNewCategory: action.category.includes('-'),
      };
    default:
      return state;
  }
};

const CategoryNameEditor = ({ category }: CategoryNameEditorProps) => {
  const { updateCategoryName, deleteCategory, editingCategory, setEditingCategory } =
    useVariableStore();
  const [state, dispatch] = useReducer(reducer, {
    name: category.includes('-') ? '' : category,
    isNewCategory: category.includes('-'),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingCategory === category;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    dispatch({ type: 'START_EDIT', category });
    setEditingCategory(category);
  };

  const handleCancel = () => {
    if (state.isNewCategory) {
      deleteCategory(category);
    }
    dispatch({ type: 'CANCEL', category });
    setEditingCategory(null);
  };

  const handleCommit = () => {
    if (state.name.trim()) {
      updateCategoryName(category, state.name.trim());
    } else if (state.isNewCategory) {
      deleteCategory(category);
    }
    setEditingCategory(null);
  };

  return isEditing ? (
    <Input
      ref={inputRef}
      value={state.name}
      onChange={e => dispatch({ type: 'UPDATE_NAME', name: e.target.value })}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          handleCommit();
        } else if (e.key === 'Escape') {
          handleCancel();
        }
      }}
      onBlur={handleCancel}
      className="w-full max-w-[200px] h-8"
    />
  ) : (
    <span className="text-left cursor-pointer hover:underline" onClick={handleEdit}>
      {category}
    </span>
  );
};

export { CategoryNameEditor };
