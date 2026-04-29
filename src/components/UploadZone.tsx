import { Box, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { colors } from '@/themes/colors';
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
        border: `2px dashed ${colors.secondary.gray2}`,
        borderRadius: radius[2],
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: colors.dominant.white2,
        '&:hover': { bgcolor: colors.dominant.white3, borderColor: colors.primary.main },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={() => document.getElementById(id)?.click()}
    >
      <input
        id={id}
        type="file"
        hidden
        onChange={onFileChange}
      />
      <UploadFileIcon sx={{ fontSize: 48, color: file ? colors.primary.main : colors.secondary.gray3, mb: 1 }} />
      <Typography variant="body1" fontWeight={600} color="textPrimary">
        {file ? file.name : 'Click or Drag to upload document'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        PDF, DOCX, XLSX up to 10MB
      </Typography>
    </Box>
  );
};

export default UploadZone;
