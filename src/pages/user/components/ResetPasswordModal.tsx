import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';
import { useTranslation } from 'react-i18next';
import { resetPasswordService } from '@/services/userService';
import { getErrorAlert, getSuccessAlert } from '@/utils/functions/sweetAlert/sweetAlert';

interface ResetPasswordModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
}

const ResetPasswordModal = ({ open, userId, onClose }: ResetPasswordModalProps) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs = { newPassword: '', confirmPassword: '' };
    if (!newPassword) {
      errs.newPassword = t('validation.passwordRequired');
    } else if (newPassword.length < 6) {
      errs.newPassword = t('auth.passwordMinLength');
    }
    if (!confirmPassword) {
      errs.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = t('validation.passwordMismatch');
    }
    setErrors(errs);
    return !errs.newPassword && !errs.confirmPassword;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await resetPasswordService(userId, newPassword, confirmPassword);
      await getSuccessAlert(t('users.passwordResetSuccess'));
      handleClose();
    } catch (error) {
      getErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrors({ newPassword: '', confirmPassword: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockResetIcon color="primary" />
          <Typography variant="h6" component="span">
            {t('users.resetPassword')}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
          <TextFieldPassword
            fullWidth
            label={t('users.newPassword')}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: '' }));
            }}
            disabled={loading}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextFieldPassword
            fullWidth
            label={t('users.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
            }}
            disabled={loading}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
