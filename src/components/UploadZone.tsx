import { Box, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { radius } from '@/themes/radius';

interface UploadZoneProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

const UploadZone = ({ file, onFileChange, id = 'file-upload' }: UploadZoneProps) => {
  return (
    <Box
      sx={{
        border: `2px dashed ${file ? '#10B981' : '#6366F1'}`,
        borderRadius: radius[2],
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: file ? '#F0FDF4' : '#EEF2FF',
        '&:hover': {
          bgcolor: file ? '#DCFCE7' : '#E0E7FF',
          borderColor: file ? '#059669' : '#4F46E5',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={() => document.getElementById(id)?.click()}
    >
      <input id={id} type="file" hidden onChange={onFileChange} />

      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          mx: 'auto',
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: file ? '#10B981' : '#6366F1',
          transition: 'background-color 0.2s',
        }}
      >
        {file
          ? <CheckCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
          : <UploadFileIcon sx={{ fontSize: 28, color: '#fff' }} />
        }
      </Box>

      <Typography variant="body1" fontWeight={700} color={file ? '#059669' : 'text.primary'}>
        {file ? file.name : 'Click or Drag to upload document'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        PDF, DOCX, XLSX • up to 10MB
      </Typography>
    </Box>
  );
};

export default UploadZone;
