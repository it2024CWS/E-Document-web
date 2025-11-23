import { SEARCH_ICON } from '@/utils/constants/icon';
import { InputAdornment, SvgIcon, TextField, TextFieldProps } from '@mui/material';
import SVG from 'react-inlinesvg';

const TextFieldSearch = (props?: TextFieldProps) => {
  return (
    <TextField
      placeholder="ຄົ້ນຫາ"
      fullWidth
      {...props}
      type="search"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <SvgIcon sx={{ width: 24, height: 24 }}>
                <SVG src={SEARCH_ICON} />
              </SvgIcon>
            </InputAdornment>
          ),
        },
        inputLabel: {
          sx: {
            transform: 'translate(14px, 16px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      }}
    />
  );
};

export default TextFieldSearch;
