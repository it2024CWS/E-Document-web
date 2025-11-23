import { 
//   InputAdornment, 
//   SvgIcon, 
  TextField, 
  TextFieldProps
} from '@mui/material';

interface TextFieldSelectProps extends Omit<TextFieldProps, 'onClick'> {
  displayValue?: string;
}

const TextFieldSelect = ({ 
//   onFieldClick,
  displayValue = '',
  placeholder = "Select option",
  ...props 
}: TextFieldSelectProps) => {

//   const handleClick = () => {
//     onFieldClick?.();
//   };

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      fullWidth
      {...props}
      disabled
      value={displayValue}
    //   onClick={handleClick}
      sx={{
        cursor: 'pointer',
        '& .MuiInputBase-input': {
          cursor: 'pointer',
        },
        ...props.sx,
      }}
    //   slotProps={{
    //     input: {
    //       endAdornment: (
    //         <InputAdornment position="end">
    //           <SvgIcon sx={{ color: '#666' }}>
    //             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    //               <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //             </svg>
    //           </SvgIcon>
    //         </InputAdornment>
    //       ),
    //       sx: {
    //         m: 0,
    //       },
    //     },
    //     inputLabel: {
    //       sx: {
    //         transform: 'translate(14px, 16px) scale(1)',
    //         '&.MuiInputLabel-shrink': {
    //           transform: 'translate(14px, -9px) scale(0.75)',
    //         },
    //       },
    //     },
    //   }}
    />
  );
};

export default TextFieldSelect;