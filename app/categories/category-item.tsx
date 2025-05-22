'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CategoryNameEditor } from './category-editor';
import { type Variable } from '@/store/variables';
import { VariableTable } from '../variables/variable-table';

interface CategoryItemProps {
  category: string;
  variables: Variable[];
}

const CategoryItem = ({ category, variables }: CategoryItemProps) => {
  return (
    <AccordionItem value={category}>
      <AccordionTrigger>
        <CategoryNameEditor category={category} />
      </AccordionTrigger>

      <AccordionContent>
        <VariableTable variables={variables} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoryItem;
