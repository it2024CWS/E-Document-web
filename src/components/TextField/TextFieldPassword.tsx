import { Box, IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { forwardRef, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RedStar from '../RedStar';

const TextFieldPassword = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { label, required, InputLabelProps, ...rest } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <TextField
      {...rest}
      ref={ref}
      fullWidth
      size="medium"
      required={required}
      label={
        required ? (
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
            {label} <RedStar />
          </Box>
        ) : (
          label
        )
      }
      InputLabelProps={{
        ...InputLabelProps,
        sx: {
          ...InputLabelProps?.sx,
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
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
