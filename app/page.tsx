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

interface Variable {
  name: string;
  category: string;
  value: string | number;
  id: string;
}

const Home = () => {
  const [categories, setCategories] = React.useState<{ [key: string]: Variable[] }>({});

  React.useEffect(() => {
    // Inline JSON data
    const data: Variable[] = [
      { name: 'revenue', category: 'Sales', value: 12000, id: '1' },
      { name: 'expenses', category: 'Sales', value: 5000, id: '2' },
      { name: 'profit', category: 'Sales', value: 'revenue - expenses', id: '3' },
      { name: 'ad_budget', category: 'Marketing', value: 3000, id: '4' },
      { name: 'clicks', category: 'Marketing', value: 150, id: '5' },
      { name: 'stock', category: 'Operations', value: 400, id: '6' },
      { name: 'shipments', category: 'Operations', value: '100 + 200', id: '7' },
    ];

    // Group variables by category
    const grouped = data.reduce(
      (acc, variable) => {
        const { category } = variable;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(variable);
        return acc;
      },
      {} as { [key: string]: Variable[] },
    );

    setCategories(grouped);
  }, []);

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-2">
      <TypographyH1>Welcome to Magic Formula!</TypographyH1>

      <Accordion className="w-full max-w-2xl" type="multiple">
        {Object.entries(categories).map(([category, variables]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[33%]">Name</TableHead>
                    <TableHead className="w-[67%]">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variables.map(variable => (
                    <TableRow key={variable.id}>
                      <TableCell className="w-[33%]">{variable.name}</TableCell>
                      <TableCell className="w-[67%]">{variable.value || 'Not set'}</TableCell>
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
