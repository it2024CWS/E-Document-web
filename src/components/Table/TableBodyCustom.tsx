import { TableBody, TableBodyProps } from '@mui/material';

interface Props extends TableBodyProps {
  children?: React.ReactNode;
}

const TableBodyCustom = ({ children, ...props }: Props) => {
  return (
    <TableBody
      {...props}
      sx={{
        '& .MuiTableRow-root:nth-of-type(odd)': {
          backgroundColor: '#fafafa',
        },
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: '#ffffff',
        },
      }}
    >
      {children}
    </TableBody>
  );
};

export default TableBodyCustom;
