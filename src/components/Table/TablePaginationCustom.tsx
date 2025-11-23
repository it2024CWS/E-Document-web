import { TablePagination } from '@mui/material';

interface Props {
  count?: number;
  onPageChange?: (newPage: number) => void;
  page?: number;
  rowsPerPage?: number;
  onRowsPerPageChange?: (e: number) => void;
}

const TablePaginationCustom = ({ count, onPageChange, page, rowsPerPage, onRowsPerPageChange }: Props) => {
  return (
    <TablePagination
      component="div"
      sx={{ bgcolor: 'white' }}
      count={count ?? 0}
      onPageChange={(_e, newPage) => onPageChange?.(newPage + 1)}
      page={page ?? 0}
      rowsPerPage={rowsPerPage ?? 10}
      onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value))}
      rowsPerPageOptions={[10, 20, 30, 40, 50]}
    />
  );
};

export default TablePaginationCustom;
