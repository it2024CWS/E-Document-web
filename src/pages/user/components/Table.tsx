import ButtonDetail from '@/components/Button/ButtonDetail';
import DataTable, { Column } from '@/components/Table/DataTable';
import { BoxProps, Chip, Avatar } from '@mui/material';
import { UserModel } from '@/models/userModel';
import { memo, useMemo } from 'react';

interface TableProps extends BoxProps {
  users: UserModel[];
  onSelectUser: (user: UserModel) => void;
  totalUsers?: number;
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newLimit: number) => void;
}

const Table = memo(({ 
  users, 
  onSelectUser, 
  totalUsers, 
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  ...props 
}: TableProps) => {
  
  const columns = useMemo((): Column<UserModel>[] => [
    { 
      label: 'Profile', 
      content: (item) => (
        <Avatar
          src={item.profile_picture || undefined}
          alt={item.username}
          sx={{ width: 40, height: 40 }}
        >
          {item.username?.charAt(0)?.toUpperCase() ?? '?'}
        </Avatar>
      )
    },
    { label: 'Username', content: (item) => item.username },
    { label: 'Email', content: (item) => item.email },
    { 
      label: 'Full Name', 
      content: (item) => (
        item.firstname || item.lastname
          ? `${item.firstname} ${item.lastname}`.trim()
          : '-'
      )
    },
    { 
      label: 'Role', 
      content: (item) => (
        item.role_name ? (
          <Chip
            label={item.role_name}
            size="small"
            color="primary"
            variant="outlined"
          />
        ) : '-'
      )
    },
    { label: 'Phone', content: (item) => item.phone || '-' },
    { 
      label: '', 
      align: 'right', 
      content: (item) => <ButtonDetail onClick={() => onSelectUser(item)} /> 
    },
  ], [onSelectUser]);

  return (
    <DataTable
      {...props}
      columns={columns}
      data={users}
      loading={loading}
      totalItems={totalUsers}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      countLabel="All Users"
    />
  );
});

Table.displayName = 'Table';

export default Table;
