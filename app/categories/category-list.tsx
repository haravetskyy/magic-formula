'use client';

import { Accordion } from '@/components/ui/accordion';
import { useCategoryStore } from '@/store/categories';
import { useVariableStore, Variable } from '@/store/variables';
import { CategoryItem } from './category-item';

const CategoryList = () => {
  const { categories } = useCategoryStore();
  const { variables } = useVariableStore();

  return (
    <Accordion className="w-full max-w-2xl" type="single" collapsible>
      {categories.map(category => (
        <CategoryItem
          key={category}
          category={category}
          variables={variables.filter((v: Variable) => v.category === category)}
        />
      ))}
    </Accordion>
  );
};

export { CategoryList };
