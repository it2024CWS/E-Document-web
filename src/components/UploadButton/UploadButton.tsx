import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { colors } from '@/themes/colors';
import useMainDrawerControllerContext from '@/layouts/context';
import { useLocation } from 'react-router-dom';
import { DOCUMENT_PATH } from '@/routes/config';

const UploadButton = () => {
    const { triggerAddDocument } = useMainDrawerControllerContext();
    const location = useLocation();
    
    // Disable if the current path is not inside My Files
    const isDisabled = !location.pathname.startsWith(DOCUMENT_PATH);

    return (
        <Button
            variant="contained"
            onClick={triggerAddDocument}
            startIcon={<AddIcon />}
            disabled={isDisabled}
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
                '&.Mui-disabled': {
                    bgcolor: '#e0e0e0', // gray out background
                    color: '#9e9e9e',   // gray out text
                    boxShadow: 'none',
                }
            }}
        >
            Add
        </Button>
    );
};

export default UploadButton;
