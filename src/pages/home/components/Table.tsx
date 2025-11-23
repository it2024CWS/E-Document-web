import ButtonDetail from '@/components/Button/ButtonDetail';
import TableBodyCell from '@/components/Table/TableBodyCell';
import TableBodyCustom from '@/components/Table/TableBodyCustom';
import TableCustom from '@/components/Table/TableCustom';
import TableHeadCell from '@/components/Table/TableHeadCell';
import TablePaginationCustom from '@/components/Table/TablePaginationCustom';
import { radius } from '@/themes/radius';
import { TableContainer, TableHead, TableRow, BoxProps, Box } from '@mui/material';
import useMainControllerContext from '../context';

const Table = (props?: BoxProps) => {
  const ctrl = useMainControllerContext();

  const headLists: { label: string; align?: 'right' | 'left' | 'center' | 'inherit' | 'justify' }[] = [
    { label: 'Link' },
    { label: 'Serial no' },
    { label: 'Bar type' },
    { label: 'Lot' },
    { label: 'Month' },
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
                <TableBodyCell>https://youtu.be/DmWWqogr_r8?si=NP5ikEyUc3mQoCpf</TableBodyCell>
                <TableBodyCell>Adasdasas</TableBodyCell>
                <TableBodyCell>A54598</TableBodyCell>
                <TableBodyCell>A10000000</TableBodyCell>
                <TableBodyCell>A</TableBodyCell>
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
