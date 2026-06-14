import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
    FormControl,
    Stack,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { DocumentModel, VersionModel } from '@/models/documentModel';
import { FolderModel } from '@/models/folderModel';
import { colors } from '@/themes/colors';
import { getFileIcon } from '@/utils/documentUtils';
import FolderIcon from '@mui/icons-material/Folder';
import JSZip from 'jszip';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/dateUtils';
import { documentService } from '@/services/documentService';
import { getPresignedUrl } from '@/services/fileService';

interface DocumentDetailSidebarProps {
    open: boolean;
    onClose: () => void;
    item: DocumentModel | FolderModel | null;
    type: 'document' | 'folder';
    onEdit: (item: DocumentModel | FolderModel) => void;
    onDelete: (item: DocumentModel | FolderModel) => void;
    versionsKey?: number;
}

const DetailRow = ({ label, value, breakAll }: { label: string; value: React.ReactNode; breakAll?: boolean }) => (
    <ListItem disableGutters>
        <ListItemText
            primary={label}
            secondary={value}
            slotProps={{
                primary: { variant: 'body2', color: 'text.secondary' } as any,
                secondary: { variant: 'body1', color: 'text.primary', sx: breakAll ? { wordBreak: 'break-all' } : undefined } as any,
            }}
        />
    </ListItem>
);

const DocumentDetailSidebar = ({
    open,
    onClose,
    item,
    type,
    onEdit,
    onDelete,
    versionsKey = 0,
}: DocumentDetailSidebarProps) => {
    const { t } = useTranslation();
    const isDoc = type === 'document';
    const docItem = item as DocumentModel;
    const folderItem = item as FolderModel;

    const [versions, setVersions] = useState<VersionModel[]>([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState<string>('');
    const [viewLoading, setViewLoading] = useState(false);
    const [folderDownloading, setFolderDownloading] = useState(false);

    useEffect(() => {
        if (item && isDoc && docItem.id) {
            setVersions([]);
            setSelectedVersionId('');
            const load = async () => {
                setVersionsLoading(true);
                try {
                    const result = await documentService.getDocumentVersions(docItem.id);
                    setVersions(result);
                    setSelectedVersionId(result[0]?.id ?? '');
                } catch (e) {
                    console.error('Failed to fetch versions', e);
                } finally {
                    setVersionsLoading(false);
                }
            };
            load();
        }
    }, [item, versionsKey]);

    if (!item) return null;

    const selectedVersion = versions.find(v => v.id === selectedVersionId) ?? null;
    const displayFileType = selectedVersion?.file_type || docItem.file_type || docItem.type || docItem.doc_name || '';
    const createDate = formatDate((item as any).created_at);
    const updateDate = formatDate(item.updated_at);

    const handleDownloadFolder = async () => {
        if (!folderItem.id) return;
        setFolderDownloading(true);
        try {
            const { items } = await documentService.getDocumentsByFolder(folderItem.id);
            const zip = new JSZip();

            await Promise.all(
                items.map(async (doc) => {
                    const versionList = await documentService.getDocumentVersions(doc.id);
                    const latest = versionList[0];
                    if (!latest?.doc_path) return;
                    const url = await getPresignedUrl(latest.doc_path);
                    if (!url) return;
                    const res = await fetch(url);
                    const blob = await res.blob();
                    const ext = latest.file_type || doc.file_type || '';
                    zip.file(`${doc.doc_name}${ext ? '.' + ext : ''}`, blob);
                })
            );

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const blobUrl = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${folderItem.folder_name || 'folder'}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } finally {
            setFolderDownloading(false);
        }
    };

    const handleDownloadVersion = async () => {
        if (!selectedVersion?.doc_path) return;
        setViewLoading(true);
        try {
            const url = await getPresignedUrl(selectedVersion.doc_path);
            if (!url) return;
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${docItem.doc_name}.${selectedVersion.file_type || docItem.file_type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } finally {
            setViewLoading(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 380, p: 3 } }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                    {isDoc
                        ? getFileIcon(displayFileType)
                        : <FolderIcon sx={{ color: colors.accent.yellow, fontSize: 32 }} />
                    }
                    <Typography variant="h6" noWrap>
                        {isDoc ? docItem.doc_name : (folderItem.folder_name || folderItem.name)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Actions */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button variant="outlined" startIcon={<EditIcon />} fullWidth onClick={() => onEdit(item)}>
                    {t('common.edit')}
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} fullWidth onClick={() => onDelete(item)}>
                    {t('common.delete')}
                </Button>
            </Stack>

            {/* Version Selector — documents only */}
            {isDoc && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {t('common.version')}
                    </Typography>

                    {versionsLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                            <CircularProgress size={16} />
                            <Typography variant="body2" color="text.secondary">{t('common.loading')}</Typography>
                        </Box>
                    ) : (
                        <>
                            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                                <Select
                                    value={selectedVersionId}
                                    onChange={(e) => setSelectedVersionId(e.target.value)}
                                    displayEmpty
                                >
                                    {versions.map((v, idx) => (
                                        <MenuItem key={v.id} value={v.id}>
                                            {idx === 0
                                                ? t('common.currentVersion', { n: v.version_number })
                                                : `V${v.version_number} — ${formatDate(v.created_at)}`
                                            }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedVersion && (
                                <Tooltip title={t('common.downloadVersion', { n: selectedVersion.version_number })}>
                                    <span>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            startIcon={viewLoading ? <CircularProgress size={14} /> : <DownloadIcon />}
                                            onClick={handleDownloadVersion}
                                            disabled={viewLoading || !selectedVersion.doc_path}
                                        >
                                            {viewLoading
                                                ? t('common.downloading')
                                                : t('common.downloadVersion', { n: selectedVersion.version_number })}
                                        </Button>
                                    </span>
                                </Tooltip>
                            )}
                        </>
                    )}
                </Box>
            )}

            {/* Details */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('common.details')}
            </Typography>

            {isDoc ? (
                <>
                    <List disablePadding>
                        <DetailRow label={t('common.docNo')} value={docItem.doc_no || '-'} />
                        <DetailRow label={t('common.fileType')} value={(docItem.file_type || '-').toUpperCase()} />
                        <DetailRow label={t('common.currentVersionLabel')} value={`V${docItem.version_number ?? 1}`} />
                        <DetailRow label={t('common.created')} value={createDate} />
                        <DetailRow label={t('common.modified')} value={updateDate} />
                    </List>

                    {docItem.registrant_name && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                {t('common.owner')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar alt={docItem.registrant_name}>
                                    {docItem.registrant_name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2">{docItem.registrant_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{t('common.owner')}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            ) : (
                <>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={folderDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
                    onClick={handleDownloadFolder}
                    disabled={folderDownloading}
                    sx={{ mb: 2 }}
                >
                    {folderDownloading ? t('common.downloadingFolder') : t('common.downloadFolder')}
                </Button>
                <List disablePadding>
                    <DetailRow label={t('common.folderPath')} value={folderItem.folder_path || '/'} breakAll />
                    <DetailRow
                        label={t('common.subFolders')}
                        value={folderItem.sub_folders?.length ? `${folderItem.sub_folders.length}` : t('common.noSubFolders')}
                    />
                    <DetailRow label={t('common.created')} value={createDate} />
                    <DetailRow label={t('common.modified')} value={updateDate} />
                </List>
                </>
            )}
        </Drawer>
    );
};

export default DocumentDetailSidebar;
