import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import UploadZone from '@/components/UploadZone';
import DepartmentSelect from './DepartmentSelect';
import { uploadSingleFile } from '@/services/uploadService';
import { departmentService } from '@/services/departmentService';
import { DepartmentModel } from '@/models/departmentModel';
import useAuth from '@/contexts/auth/useAuth';
import { radius } from '@/themes/radius';

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDocumentModal = ({ open, onClose, onSuccess }: AddDocumentModalProps) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [sendToDirector, setSendToDirector] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const res = await departmentService.getAllDepartments(1, 100);
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

  const handleDepartmentChange = (event: any) => {
    const value = event.target.value as string[];
    setSelectedDepartments(value);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setSubmitting(true);
    try {
      await uploadSingleFile({
        file,
        targetModule: 'outgoing',
        extraMetadata: {
          description: description,
          send_to_director: sendToDirector.toString(),
          receiver_ids: selectedDepartments.join(','),
        }
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
    setSelectedDepartments([]);
    setSendToDirector(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add New Document</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* File Upload Area */}
          <Grid size={{ xs: 12 }}>
            <UploadZone
              file={file}
              onFileChange={handleFileChange}
              id="add-doc-file-upload"
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Document Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document details..."
            />
          </Grid>

          {/* Department Multi-select */}
          <Grid size={{ xs: 12 }}>
            <DepartmentSelect
              departments={departments}
              selectedDepartments={selectedDepartments}
              onChange={handleDepartmentChange}
              loading={loadingDepts}
            />
          </Grid>

          {/* Send to Director Checkbox */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendToDirector}
                  onChange={(e) => setSendToDirector(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" fontWeight={500}>
                  Send to Director
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !file}
          sx={{ borderRadius: radius[1], px: 4 }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Add Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentModal;
