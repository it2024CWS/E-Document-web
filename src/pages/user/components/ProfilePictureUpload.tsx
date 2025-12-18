import { Box, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getErrorAlert } from '@/utils/functions/sweetAlert/sweetAlert';

interface ProfilePictureUploadProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const ProfilePictureUpload = ({ value, onChange, disabled, readOnly }: ProfilePictureUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  // Sync imagePreview with value prop when it changes (fixes issue where profile picture
  // doesn't show in edit mode because the URL loads after initial mount)
  useEffect(() => {
    if (typeof value === 'string' && value) {
      setImagePreview(value);
    } else if (value instanceof File) {
      // If value is a File, create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (!value) {
      setImagePreview(null);
    }
  }, [value]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const isEditable = !readOnly && !disabled;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      getErrorAlert('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      getErrorAlert('File size must not exceed 5 MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      onChange(file);
    };
    reader.onerror = () => {
      getErrorAlert('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (isEditable) {
      document.getElementById('profile_image_input')?.click();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isEditable ? 'pointer' : 'default',
            bgcolor: '#f9f9f9',
            position: 'relative',
            overflow: 'hidden',
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={handleClick}
        >
          {isEditable && (
            <input
              id="profile_image_input"
              name="profile_image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              disabled={disabled}
            />
          )}
          {imagePreview ? (
            <>
              <Box
                component="img"
                src={imagePreview}
                alt="profile"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
              {/* Overlay for edit indication - only show in editable mode */}
              {isEditable && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <PhotoCamera sx={{ width: 40, height: 40, color: 'white', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    Select a picture
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <PhotoCamera sx={{ width: 60, height: 60, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                {readOnly ? 'No profile picture' : 'Select a picture'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {isEditable && (
        <Typography variant="caption" color="textSecondary" textAlign="center" display="block" mt={2}>
          Max file size: 5 MB
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePictureUpload;
