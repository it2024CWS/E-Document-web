import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';

interface DocumentDetailModalProps {
  open: boolean;
  onClose: () => void;
  document: OutgoingDocModel | null;
  loading?: boolean;
}

const DocumentDetailModal = ({ open, onClose, document, loading }: DocumentDetailModalProps) => {
  if (!document && !loading) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Document Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : document && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  {getFileIcon(document.type || document.doc_name || '')}
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {document.doc_name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Document No:</strong> {document.doc_no}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Outgoing No:</strong> {document.outgoing_no}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { md: 'right' } }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Sent Date:</strong> {new Date(document.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Sender:</strong> {document.user_name}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Recipients & Status Tracking
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: colors.secondary.blue110 }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Receiver</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Incoming No</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Received Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {document.incoming_docs && document.incoming_docs.length > 0 ? (
                    document.incoming_docs.map((inc: any) => {
                      const statusStyle = getStatusColor(inc.status);
                      return (
                        <TableRow key={inc.id}>
                          <TableCell>{inc.receiver_name || 'Pending Pickup'}</TableCell>
                          <TableCell>{inc.incoming_no}</TableCell>
                          <TableCell>
                            {inc.received_date ? new Date(inc.received_date).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inc.status}
                              size="small"
                              sx={{
                                borderRadius: '4px',
                                bgcolor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        No tracking data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDetailModal;
