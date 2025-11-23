import { Button, ButtonProps } from '@mui/material';

const ButtonSearch = (props?: ButtonProps) => {
  return (
    <Button
      variant="transparent"
      {...props}
      sx={{
        maxWidth: '112px',
        width: '100%',
        height: '55px',
      }}
    >
      Search
    </Button>
  );
};

export default ButtonSearch;
