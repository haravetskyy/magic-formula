'use client';

import { Accordion } from '@/components/ui/accordion';
import { useVariableStore } from '@/store/variables';
import CategoryItem from './category-item';

const CategoryList = () => {
  const { categories } = useVariableStore();

  return (
    <Accordion className="w-full max-w-2xl" type="multiple">
      {Object.entries(categories).map(([category, variables]) => (
        <CategoryItem key={category} category={category} variables={variables} />
      ))}
    </Accordion>
  );
};

export { CategoryList };
