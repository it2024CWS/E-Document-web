import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { colors } from '@/themes/colors';
import useMainDrawerControllerContext from '@/layouts/context';

const UploadButton = () => {
    const { triggerAddDocument } = useMainDrawerControllerContext();

    return (
        <Button
            variant="contained"
            onClick={triggerAddDocument}
            startIcon={<AddIcon />}
            sx={{
                bgcolor: colors.dominant.white1,
                color: colors.secondary.text,
                textTransform: 'none',
                textAlign: 'center',
                fontSize: 25,
                fontWeight: 500,
                height: 60,
                width: '80%',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                '&:hover': {
                    bgcolor: colors.dominant.white3,
                    boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                },
                borderRadius: '18px',
                px: 3,
                py: 1,
            }}
        >
            Add
        </Button>
    );
};

export default UploadButton;
