'use client';

import { Button } from '@/components/ui/button';
import { useVariableStore } from '@/store/variables';

const AddCategoryButton = () => {
  const { addCategory, setEditingCategory } = useVariableStore();

  const handleAddCategory = () => {
    addCategory('');

    setEditingCategory('');
  };

  return (
    <Button onClick={handleAddCategory} className="my-4">
      Add Category
    </Button>
  );
};

export { AddCategoryButton };
