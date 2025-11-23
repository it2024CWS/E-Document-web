import { Button, ButtonProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props extends ButtonProps {
  children?: React.ReactNode;
}

const ButtonAdd = ({ children, ...props }: Props) => {
  return (
    <Button variant="contained" {...props} startIcon={<AddIcon />}>
      {children}
    </Button>
  );
};

export default ButtonAdd;
