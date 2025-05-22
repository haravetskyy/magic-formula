'use client';

import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/store/categories';
import { v4 as uuidv4 } from 'uuid';

const AddCategoryButton = () => {
  const { addCategory, setEditingCategory } = useCategoryStore();

  const handleAddCategory = () => {
    const tempName = uuidv4();
    addCategory(tempName);
    setEditingCategory(tempName);
  };

  return (
    <Button onClick={handleAddCategory} className="my-4">
      + Add Category
    </Button>
  );
};

export { AddCategoryButton };
