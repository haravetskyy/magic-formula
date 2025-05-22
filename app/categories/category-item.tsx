'use client';

import React from 'react';
import { useCategoryStore } from '@/store/categories';
import { useVariableStore } from '@/store/variables';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CategoryNameEditor } from './category-editor';
import { VariableTable } from '../variables/variable-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Variable } from '@/store/variables';

interface CategoryItemProps {
  category: string;
  variables: Variable[];
}

const CategoryItem = ({ category, variables }: CategoryItemProps) => {
  const { deleteCategory } = useCategoryStore();
  const { deleteVariablesByCategory } = useVariableStore();

  const handleDelete = () => {
    deleteVariablesByCategory(category);
    deleteCategory(category);
  };

  return (
    <AccordionItem value={category}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <CategoryNameEditor category={category} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                role="button"
                aria-label="Category actions"
                onClick={e => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right">
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <VariableTable category={category} variables={variables} />
      </AccordionContent>
    </AccordionItem>
  );
};

export { CategoryItem };
