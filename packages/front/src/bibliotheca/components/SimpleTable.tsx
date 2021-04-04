import { Table, TableBody, TableCell, TableRow, Text, Box } from 'grommet';
import * as React from 'react';

interface SimpleTableProps {
  rows: Array<{
    label: string;
    render: React.ReactNode | string;
    align?: 'center' | 'start' | 'end';
  }>;
}

export const SimpleTable: React.SFC<SimpleTableProps> = ({ rows, ...rest }) => (
  <Table {...rest}>
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.label}>
          <TableCell scope="row">
            <Text weight="bold">{row.label}</Text>
          </TableCell>
          <TableCell>
            <Box alignSelf={row.align || 'center'} fill>
              {typeof row.render === 'function' ? row.render() : <Text>{String(row.render)}</Text>}
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
