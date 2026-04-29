import React from 'react';
import { TableContainer, TableHead, TableRow, Box, Divider, Typography, CircularProgress, BoxProps } from '@mui/material';
import TableCustom from './TableCustom';
import TableHeadCell from './TableHeadCell';
import TableBodyCustom from './TableBodyCustom';
import TableBodyCell from './TableBodyCell';
import TablePaginationCustom from './TablePaginationCustom';
import { radius } from '@/themes/radius';

export interface Column<T> {
  label: string;
  align?: 'left' | 'center' | 'right' | 'inherit' | 'justify';
  content: (item: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> extends BoxProps {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  totalItems?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newLimit: number) => void;
  title?: string;
  countLabel?: string;
  noDataMessage?: string;
}

const DataTable = <T extends { id?: string | number }>({
  columns,
  data,
  loading,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  title,
  countLabel = 'Total Items',
  noDataMessage = 'No data available',
  ...boxProps
}: DataTableProps<T>) => {
  return (
    <Box 
      {...boxProps} 
      sx={{ 
        bgcolor: 'white', 
        borderRadius: radius[2], 
        overflow: 'hidden', 
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        ...boxProps.sx 
      }}
    >
      {(title || totalItems !== undefined) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 } }}>
          {title ? (
             <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          ) : <Box />}
          {totalItems !== undefined && (
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
              {countLabel}: {totalItems}
            </Typography>
          )}
        </Box>
      )}
      <Divider />
      <TableContainer sx={{ minHeight: loading ? '200px' : 'auto', position: 'relative' }}>
        {loading && (
          <Box sx={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1
          }}>
            <CircularProgress size={40} />
          </Box>
        )}
        <TableCustom>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableHeadCell key={index} align={col.align ?? 'left'} style={{ width: col.width }}>
                  {col.label}
                </TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBodyCustom>
            {data.map((item, rowIndex) => (
              <TableRow key={item.id ?? rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableBodyCell key={colIndex} align={col.align ?? 'left'}>
                    {col.content(item)}
                  </TableBodyCell>
                ))}
              </TableRow>
            ))}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableBodyCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">{noDataMessage}</Typography>
                </TableBodyCell>
              </TableRow>
            )}
          </TableBodyCustom>
        </TableCustom>
      </TableContainer>
      {totalItems !== undefined && onPageChange && (
        <TablePaginationCustom
          count={totalItems}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Box>
  );
};

export default DataTable;
