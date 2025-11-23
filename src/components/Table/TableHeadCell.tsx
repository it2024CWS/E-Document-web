import { colors } from '@/themes/colors';
import { TableCell, TableCellProps } from '@mui/material';

interface Props extends TableCellProps {
  children?: React.ReactNode;
}

const TableHeadCell = ({ children, ...props }: Props) => {
  return (
    <TableCell {...props} sx={{ fontWeight: 'bold', color: colors.secondary.text, ...props?.sx }}>
      {children}
    </TableCell>
  );
};

export default TableHeadCell;
