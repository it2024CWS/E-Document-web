import { Box, Button, SvgIcon } from '@mui/material';
import { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react';
import SvgColor from './SvgColor';
import { CALENDAR_ICON } from '@/utils/constants/icon';
import { radius } from '@/themes/radius';

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string | number;
}

const InputFieldDate = ({ label, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.showPicker();
  };

  return (
    <Box style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="date"
        ref={inputRef}
        {...props}
        style={{
          ...props?.style,
          position: 'absolute',
          top: 0,
          left: 0,
          minWidth: '100%',
          height: '100%',
          opacity: 0,
        }}
      />
      <Button
        variant="contained"
        startIcon={
          <SvgIcon>
            <SvgColor src={CALENDAR_ICON} />
          </SvgIcon>
        }
        onClick={handleClick}
        sx={{
          backgroundColor: '#00000008',
          color: '#737373',
          borderRadius: radius[1],
          padding: '10px 20px',
          height: '48px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'none',
          width: '160px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            boxShadow: 'none',
          },
        }}
      >
        {props?.value ? props?.value : label}
      </Button>
    </Box>
  );
};

export default InputFieldDate;
