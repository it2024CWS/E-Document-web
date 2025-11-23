import { radius } from '@/themes/radius';
import { TableContainer, TableContainerProps } from '@mui/material';

interface Props extends TableContainerProps {
  children?: React.ReactNode;
}

const TableContainerCustom = ({ children, ...props }: Props) => {
  return (
    <TableContainer {...props} sx={{ bgcolor: 'white', borderRadius: radius[2], ...props?.sx }}>
      {children}
    </TableContainer>
  );
};

export default TableContainerCustom;
