'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CategoryNameEditor } from './category-editor';
import { VariableTable } from '../variables/variable-table';
import { Variable } from '@/store/variables';

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
        <VariableTable category={category} variables={variables} />
      </AccordionContent>
    </AccordionItem>
  );
};

export { CategoryItem };
