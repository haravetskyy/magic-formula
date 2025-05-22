import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TypographyMuted } from '@/components/ui/typography';
import { useVariableStore } from '@/store/variables';
import { Variable } from '@/store/variables';

interface VariableTableProps {
  variables: Variable[];
}

const VariableTable = ({ variables }: VariableTableProps) => {
  const { evaluateFormula } = useVariableStore();

  return (
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
            <TableCell className="w-[33%] border-r">
              <Badge variant="secondary">{variable.name}</Badge>
            </TableCell>

            <TableCell className="w-[67%]">
              {typeof variable.value === 'string'
                ? evaluateFormula(variable.value)
                : variable.value || <TypographyMuted>Not set</TypographyMuted>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { VariableTable };
