import ButtonDetail from '@/components/Button/ButtonDetail';
import DataTable, { Column } from '@/components/Table/DataTable';
import { BoxProps, Chip, Avatar } from '@mui/material';
import { UserModel } from '@/models/userModel';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const columns = useMemo((): Column<UserModel>[] => [
    {
      label: t('users.profile'),
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
    { label: t('users.username'), content: (item) => item.username },
    { label: t('common.email'), content: (item) => item.email },
    {
      label: t('users.fullName'),
      content: (item) => (
        item.firstname || item.lastname
          ? `${item.firstname} ${item.lastname}`.trim()
          : '-'
      )
    },
    {
      label: t('users.role'),
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
    { label: t('common.phone'), content: (item) => item.phone || '-' },
    {
      label: '',
      align: 'right',
      content: (item) => <ButtonDetail onClick={() => onSelectUser(item)} />
    },
  ], [onSelectUser, t]);

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
      countLabel={t('users.allUsers')}
    />
  );
});

Table.displayName = 'Table';

export default Table;
