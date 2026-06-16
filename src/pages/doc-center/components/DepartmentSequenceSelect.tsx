import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { DepartmentModel } from '@/models/departmentModel';
import { colors } from '@/themes/colors';

interface DepartmentSequenceSelectProps {
  departments: DepartmentModel[];
  selectedDepartments: string[];
  onChange: (next: string[]) => void;
  loading?: boolean;
}

const DepartmentSequenceSelect = ({
  departments,
  selectedDepartments,
  onChange,
  loading = false,
}: DepartmentSequenceSelectProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const deptName = (id: string) =>
    departments.find((d) => d.id === id)?.dept_name || id;

  const toggle = (id: string) => {
    if (selectedDepartments.includes(id)) {
      onChange(selectedDepartments.filter((d) => d !== id));
    } else {
      onChange([...selectedDepartments, id]);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= selectedDepartments.length) return;
    const next = [...selectedDepartments];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.2,
            bgcolor: '#F5F7FF',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            {t('docs.addDepartmentStep')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            — {t('docs.clickToSelect')}
          </Typography>
          {selectedDepartments.length > 0 && (
            <Box
              sx={{
                ml: 'auto',
                px: 1,
                py: 0.2,
                borderRadius: 10,
                bgcolor: colors.primary.main,
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {selectedDepartments.length} selected
            </Box>
          )}
        </Box>

        {/* Department list */}
        <Box sx={{ maxHeight: 260, overflowY: 'auto' }}>
          {departments.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('docs.allDepartmentsAdded')}
              </Typography>
            </Box>
          ) : (
            departments.map((dept, i) => {
              const selIdx = selectedDepartments.indexOf(dept.id);
              const isSelected = selIdx !== -1;

              return (
                <Box key={dept.id}>
                  {i > 0 && <Divider />}
                  <Box
                    onClick={() => toggle(dept.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.1,
                      cursor: 'pointer',
                      bgcolor: isSelected ? '#EEF4FF' : 'transparent',
                      '&:hover': {
                        bgcolor: isSelected ? '#E4EDFF' : '#F8F9FF',
                      },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {/* Sequence badge */}
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        bgcolor: isSelected ? colors.primary.main : '#E8E8E8',
                        color: isSelected ? '#fff' : '#9E9E9E',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {isSelected ? selIdx + 1 : <AddIcon sx={{ fontSize: '0.9rem' }} />}
                    </Box>

                    {/* Department name */}
                    <Typography
                      variant="body2"
                      fontWeight={isSelected ? 600 : 400}
                      sx={{ flex: 1, color: isSelected ? 'primary.dark' : 'text.primary' }}
                    >
                      {dept.dept_name}
                    </Typography>

                    {/* Reorder + remove */}
                    {isSelected && (
                      <Box sx={{ display: 'flex', gap: 0.25 }}>
                        <IconButton
                          size="small"
                          disabled={selIdx === 0}
                          onClick={(e) => { e.stopPropagation(); move(selIdx, -1); }}
                        >
                          <ArrowUpwardIcon sx={{ fontSize: '0.85rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={selIdx === selectedDepartments.length - 1}
                          onClick={(e) => { e.stopPropagation(); move(selIdx, 1); }}
                        >
                          <ArrowDownwardIcon sx={{ fontSize: '0.85rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => { e.stopPropagation(); toggle(dept.id); }}
                        >
                          <CloseIcon sx={{ fontSize: '0.85rem' }} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Paper>

      {/* Route summary */}
      {selectedDepartments.length > 0 && (
        <Box sx={{ mt: 1, px: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {t('docs.routeOrder')}:{' '}
            {selectedDepartments.map((id, i) => `${i + 1}. ${deptName(id)}`).join(' → ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DepartmentSequenceSelect;
