'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TypographyH1 } from '@/components/ui/typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import { useVariableStore, Variable } from '@/store/variables';
import { Badge } from '@/components/ui/badge';

const Home = () => {
  const { categories, evaluateFormula } = useVariableStore();

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-2">
      <TypographyH1>Welcome to Magic Formula!</TypographyH1>

      <Accordion className="w-full max-w-2xl" type="multiple">
        {Object.entries(categories).map(([category, variables]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>

            <AccordionContent>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[33%] border-r">Name</TableHead>

                    <TableHead className="w-[67%]">Value</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {variables.map((variable: Variable) => (
                    <TableRow key={variable.id}>
                      <TableCell className="w-[33%] border-r">{variable.name}</TableCell>

                      <TableCell className="w-[67%]">
                        {typeof variable.value === 'string'
                          ? evaluateFormula(variable.value)
                          : variable.value || 'Not set'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default Home;
