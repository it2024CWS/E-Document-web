import { Table, TableProps } from '@mui/material';

interface Props extends TableProps {
  children?: React.ReactNode;
}

const TableCustom = ({ children, ...props }: Props) => {
  return (
    <Table
      {...props}
      sx={{
        '& .MuiTableHead-root .MuiTableCell-root': {
          borderBottom: 'none',
        },
        '& .MuiTableBody-root .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }}
    >
      {children}
    </Table>
  );
};

export default TableCustom;
