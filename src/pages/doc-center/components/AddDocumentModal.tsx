import { useState } from 'react';
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

import { uploadSingleFile } from '@/services/uploadService';
import { radius } from '@/themes/radius';

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDocumentModal = ({ open, onClose, onSuccess }: AddDocumentModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [sendToDirector, setSendToDirector] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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
        }
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to upload document', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Button onClick={onClose} color="inherit">Cancel</Button>
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
