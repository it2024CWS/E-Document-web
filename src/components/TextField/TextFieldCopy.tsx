import { forwardRef, useState } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps, Snackbar } from '@mui/material';
import { DOCUMENT_COPY_ICON } from '@/utils/constants/icon';

const TextFieldCopy = forwardRef<HTMLDivElement, TextFieldProps>(({ value = 'Test clipboard', ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    if (value !== undefined && value !== null) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        setOpen(true);
      });
    }
  };

  return (
    <>
      <TextField
        ref={ref}
        {...props}
        value={value}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleCopy}>
                  <img src={DOCUMENT_COPY_ICON} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
});

export default TextFieldCopy;
