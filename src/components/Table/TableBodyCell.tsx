import { TableCell, TableCellProps } from '@mui/material';

interface Props extends TableCellProps {
  children?: React.ReactNode;
}

const TableBodyCell = ({ children, ...props }: Props) => {
  return <TableCell {...props}>{children}</TableCell>;
};

export default TableBodyCell;
