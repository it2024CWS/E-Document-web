import ButtonDetail from '@/components/Button/ButtonDetail';
import TableBodyCell from '@/components/Table/TableBodyCell';
import TableBodyCustom from '@/components/Table/TableBodyCustom';
import TableCustom from '@/components/Table/TableCustom';
import TableHeadCell from '@/components/Table/TableHeadCell';
import TablePaginationCustom from '@/components/Table/TablePaginationCustom';
import { radius } from '@/themes/radius';
import { TableContainer, TableHead, TableRow, BoxProps, Box, Chip, Avatar, Typography, Divider } from '@mui/material';
import { UserRoleLabels } from '@/enums/userRoleEnum';
import { UserModel } from '@/models/userModel';
import { memo } from 'react';

interface TableProps extends BoxProps {
  users: UserModel[];
  onSelectUser: (user: UserModel) => void;
  totalUsers?: number;
}

const Table = memo(({ users, onSelectUser, totalUsers, ...props }: TableProps) => {
  const headLists: { label: string; align?: 'right' | 'left' | 'center' | 'inherit' | 'justify' }[] = [
    { label: 'Profile' },
    { label: 'Username' },
    { label: 'Email' },
    { label: 'Name' },
    { label: 'Role' },
    { label: 'Phone' },
    { label: '', align: 'right' },
  ];

  return (
    <Box {...props} sx={{ bgcolor: 'white', borderRadius: radius[2], overflow: 'hidden' }}>
      {/* All Users Count - displayed above table header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: { xs: 2, md: 3 }, pb: { xs: 0, md: 2 } }}>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
          All Users: {totalUsers ?? 0}
        </Typography>
      </Box>
      <Divider />
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
            {users?.map((item) => {
              const initial = item.username?.charAt(0)?.toUpperCase() ?? '?';

              return (
                <TableRow key={item?.id}>
                  {/* Profile picture column */}
                  <TableBodyCell>
                    <Avatar
                      src={item.profile_picture || undefined}
                      alt={item.username}
                      sx={{ width: 40, height: 40 }}
                    >
                      {initial}
                    </Avatar>
                  </TableBodyCell>
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
                    <ButtonDetail onClick={() => onSelectUser(item)} />
                  </TableBodyCell>
                </TableRow>
              );
            })}
          </TableBodyCustom>
        </TableCustom>
      </TableContainer>
      <TablePaginationCustom />
    </Box>
  );
});

Table.displayName = 'Table';

export default Table;
