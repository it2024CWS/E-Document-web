import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadZone from '@/components/UploadZone';
import DepartmentSequenceSelect from './DepartmentSequenceSelect';
import { uploadSingleFile } from '@/services/uploadService';
import { departmentService } from '@/services/departmentService';
import { documentService } from '@/services/documentService';
import { DepartmentModel } from '@/models/departmentModel';
import useAuth from '@/contexts/auth/useAuth';
import { useTranslation } from 'react-i18next';

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type DocNoStatus = 'idle' | 'checking' | 'available' | 'taken';

const AddDocumentModal = ({ open, onClose, onSuccess }: AddDocumentModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [docNo, setDocNo] = useState('');
  const [docNoStatus, setDocNoStatus] = useState<DocNoStatus>('idle');
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  // Debounced uniqueness check for doc_no
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = docNo.trim();
    if (!trimmed) {
      setDocNoStatus('idle');
      return;
    }
    setDocNoStatus('checking');
    debounceRef.current = setTimeout(async () => {
      const available = await documentService.checkDocNo(trimmed);
      setDocNoStatus(available ? 'available' : 'taken');
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [docNo]);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const res = await departmentService.getAllDepartments(1, 100);
      // Exclude only the owner's own department (backend excludes it from the recipient route).
      const filtered = res.items.filter((d) => d.id !== user?.department_id);
      setDepartments(filtered);
    } catch (error) {
      console.error('Failed to fetch departments', error);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const docNoError = docNoStatus === 'taken';
  const canSubmit =
    !!file &&
    docNo.trim().length > 0 &&
    docNoStatus === 'available' &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;

    setSubmitting(true);
    try {
      await uploadSingleFile({
        file,
        targetModule: 'outgoing',
        extraMetadata: {
          doc_no: docNo.trim(),
          description: description,
          receiver_ids: selectedDepartments.join(','),
        },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to upload document', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setDescription('');
    setDocNo('');
    setDocNoStatus('idle');
    setSelectedDepartments([]);
    onClose();
  };

  const docNoHelperText = () => {
    if (docNoStatus === 'taken') return t('docs.docNoTaken');
    if (docNoStatus === 'available') return t('docs.docNoAvailable');
    return '';
  };

  const docNoEndAdornment =
    docNoStatus === 'checking' ? (
      <InputAdornment position="end">
        <CircularProgress size={18} />
      </InputAdornment>
    ) : docNoStatus === 'available' ? (
      <InputAdornment position="end">
        <CheckCircleIcon color="success" fontSize="small" />
      </InputAdornment>
    ) : undefined;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '95vw', sm: '80vw', md: '65vw', lg: '55vw' },
            maxWidth: '900px',
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{t('docs.addNewDocument')}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <UploadZone
              file={file}
              onFileChange={handleFileChange}
              id="add-doc-file-upload"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label={t('docs.documentNumber')}
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
              error={docNoError}
              color={docNoStatus === 'available' ? 'success' : undefined}
              helperText={docNoHelperText()}
              placeholder={t('docs.docNoPlaceholder')}
              slotProps={{ input: { endAdornment: docNoEndAdornment } }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t('docs.documentDescription')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('docs.descriptionPlaceholder')}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DepartmentSequenceSelect
              departments={departments}
              selectedDepartments={selectedDepartments}
              onChange={setSelectedDepartments}
              loading={loadingDepts}
            />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">{t('common.cancel')}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
        >
          {submitting ? <CircularProgress size={24} /> : t('common.addDocument')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentModal;
