import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { forwardRef, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const TextFieldPassword = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <TextField
      {...props}
      ref={ref}
      fullWidth
      size="medium"
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label={showPassword ? 'hide the password' : 'display the password'} onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
});

export default TextFieldPassword;
