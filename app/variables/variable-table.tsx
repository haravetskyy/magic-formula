'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useVariableStore, Variable } from '@/store/variables';
import { VariableEditor } from './variable-editor';
import { v4 as uuidv4 } from 'uuid';
import { TypographyMuted } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

interface VariableTableProps {
  category: string;
  variables: Variable[];
}

const VariableTable = ({ category, variables }: VariableTableProps) => {
  const { addVariable, deleteVariable } = useVariableStore();
  const [editingVariableId, setEditingVariableId] = React.useState<string | null>(null);

  const handleAddVariable = () => {
    const id = uuidv4();
    addVariable(category, id, '', id);
    setEditingVariableId(id);
  };

  return (
    <div>
      <Button onClick={handleAddVariable} className="mb-2">
        + Add Variable
      </Button>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[33%] border-r">Name</TableHead>

            <TableHead className="w-[67%]">Value</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {variables.map(variable => (
            <TableRow key={variable.id}>
              {editingVariableId === variable.id ? (
                <VariableEditor
                  variable={variable}
                  isNew={variable.name === variable.id && !variable.value}
                  onSave={() => setEditingVariableId(null)}
                  onCancel={() => {
                    if (variable.name === variable.id && !variable.value) {
                      deleteVariable(variable.id);
                    }
                    setEditingVariableId(null);
                  }}
                />
              ) : (
                <>
                  <TableCell className="w-[33%] border-r">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => setEditingVariableId(variable.id)}>
                      <Badge variant="secondary">{variable.name}</Badge>
                    </span>
                  </TableCell>

                  <TableCell className="w-[67%]">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => setEditingVariableId(variable.id)}>
                      {variable.value.toString().startsWith('=')
                        ? useVariableStore.getState().evaluateFormula(variable.value.toString())
                        : variable.value || <TypographyMuted>Not set</TypographyMuted>}
                    </span>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { VariableTable };
