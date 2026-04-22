import { Box, TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import RedStar from '../RedStar';

const TextFieldCustom = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { label, required, InputLabelProps, ...rest } = props;

  return (
    <TextField
      {...rest}
      ref={ref}
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
    />
  );
});

export default TextFieldCustom;
