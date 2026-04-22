import { Box, InputLabel, InputLabelProps } from '@mui/material';
import RedStar from './RedStar';
import { ReactNode } from 'react';

interface InputLabelCustomProps extends InputLabelProps {
  label: ReactNode;
}

const InputLabelCustom = ({ label, required, sx, ...props }: InputLabelCustomProps) => {
  return (
    <InputLabel
      {...props}
      required={required}
      sx={{
        ...sx,
        '& .MuiFormLabel-asterisk': {
          display: 'none',
        },
      }}
    >
      {required ? (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {label} <RedStar />
        </Box>
      ) : (
        label
      )}
    </InputLabel>
  );
};

export default InputLabelCustom;
