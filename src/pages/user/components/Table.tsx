import ButtonDetail from '@/components/Button/ButtonDetail';
import TableBodyCell from '@/components/Table/TableBodyCell';
import TableBodyCustom from '@/components/Table/TableBodyCustom';
import TableCustom from '@/components/Table/TableCustom';
import TableHeadCell from '@/components/Table/TableHeadCell';
import TablePaginationCustom from '@/components/Table/TablePaginationCustom';
import { radius } from '@/themes/radius';
import { TableContainer, TableHead, TableRow, BoxProps, Box, Chip } from '@mui/material';
import useMainControllerContext from '../context';
import { UserRoleLabels } from '@/enums/userRoleEnum';

const Table = (props?: BoxProps) => {
  const ctrl = useMainControllerContext();

  const headLists: { label: string; align?: 'right' | 'left' | 'center' | 'inherit' | 'justify' }[] = [
    { label: 'Username' },
    { label: 'Email' },
    { label: 'Name' },
    { label: 'Role' },
    { label: 'Phone' },
    { label: '', align: 'right' },
  ];

  return (
    <Box {...props} sx={{ bgcolor: 'white', borderRadius: radius[2], overflow: 'hidden' }}>
      <TableContainer>
        <TableCustom>
          <TableHead>
            <TableRow>
              {headLists.map((item, index) => {
                return (
                  <TableHeadCell key={index} align={item.align ?? 'left'}>
                    {item.label}
                  </TableHeadCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBodyCustom>
            {ctrl?.data?.info?.map((item) => (
              <TableRow key={item?.id}>
                <TableBodyCell>{item.username}</TableBodyCell>
                <TableBodyCell>{item.email}</TableBodyCell>
                <TableBodyCell>
                  {item.first_name || item.last_name
                    ? `${item.first_name} ${item.last_name}`.trim()
                    : '-'}
                </TableBodyCell>
                <TableBodyCell>
                  {item.role ? (
                    <Chip
                      label={UserRoleLabels[item.role as keyof typeof UserRoleLabels] || item.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    '-'
                  )}
                </TableBodyCell>
                <TableBodyCell>{item.phone || '-'}</TableBodyCell>
                <TableBodyCell align="right">
                  <ButtonDetail onClick={() => ctrl.handleChangeSelectedItem(item)} />
                </TableBodyCell>
              </TableRow>
            ))}
          </TableBodyCustom>
        </TableCustom>
      </TableContainer>
      <TablePaginationCustom />
    </Box>
  );
};

export default Table;
