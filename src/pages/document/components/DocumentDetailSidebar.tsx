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
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DocumentModel, VersionModel } from '@/services/documentService';
import { FolderModel } from '@/models/folderModel';
import { colors } from '@/themes/colors';
import { getFileIcon } from '@/utils/documentUtils';
import FolderIcon from '@mui/icons-material/Folder';
import { useState, useEffect } from 'react';

interface DocumentDetailSidebarProps {
    open: boolean;
    onClose: () => void;
    item: DocumentModel | FolderModel | null;
    type: 'document' | 'folder';
    onEdit: (item: DocumentModel | FolderModel) => void;
    onDelete: (item: DocumentModel | FolderModel) => void;
    versions?: VersionModel[]; // Only for documents
    onVersionChange?: (versionId: number) => void; // Only for documents
}

const DocumentDetailSidebar = ({
    open,
    onClose,
    item,
    type,
    onEdit,
    onDelete,
    versions = [],
    onVersionChange
}: DocumentDetailSidebarProps) => {
    if (!item) return null;

    const isDoc = type === 'document';
    const docItem = item as DocumentModel;
    const folderItem = item as FolderModel;

    // Mock owner info if missing
    const ownerName = isDoc ? docItem.registrant_name || 'System' : 'Admin';
    const ownerEmail = (item as any).user_email || `${ownerName.toLowerCase().replace(' ', '.')}@company.com`;
    const ownerPhone = (item as any).user_phone || '+856 20 5555 8888';
    const ownerAvatar = (item as any).user_avatar || '';
    const department = (item as any).department_name || 'General Department';
    const sector = (item as any).sector || 'IT Sector';
    const createDate = new Date((item as any).created_at || Date.now()).toLocaleDateString();
    const updateDate = new Date(item.updated_at || Date.now()).toLocaleDateString();

    const [selectedVersion, setSelectedVersion] = useState<number>(isDoc ? docItem.version_number : 1);

    useEffect(() => {
        if (isDoc && docItem) {
            setSelectedVersion(docItem.version_number);
        }
    }, [docItem, isDoc]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 380, p: 3 }
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                    {isDoc ? getFileIcon(docItem.doc_name) : <FolderIcon sx={{ color: colors.accent.yellow, fontSize: 32 }} />}
                    <Typography variant="h6" noWrap>
                        {isDoc ? docItem.doc_name : folderItem.name}
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Actions */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    fullWidth
                    onClick={() => onEdit(item)}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    onClick={() => onDelete(item)}
                >
                    Delete
                </Button>
            </Stack>

            {/* Document Specific: Version Selector */}
            {isDoc && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Version
                    </Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={selectedVersion}
                            onChange={(e) => {
                                const newVer = Number(e.target.value);
                                setSelectedVersion(newVer);
                                onVersionChange?.(newVer);
                            }}
                        >
                            <MenuItem value={docItem.version_number}>current (V{docItem.version_number})</MenuItem>
                            {/* Mock past versions if versions prop is empty for now */}
                            {versions.length > 0 ? (
                                versions.map(v => (
                                    <MenuItem key={v.id} value={v.version_number}>V{v.version_number} - {new Date(v.created_at).toLocaleDateString()}</MenuItem>
                                ))
                            ) : (
                                [1, 2, 3].filter(v => v < docItem.version_number).map(v => (
                                    <MenuItem key={v} value={v}>V{v} - {new Date().toLocaleDateString()}</MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Details Section */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Details
            </Typography>

            <List disablePadding>
                {/* Department */}
                <ListItem disableGutters>
                    <ListItemText
                        primary="Department"
                        secondary={department}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary' }}
                    />
                </ListItem>

                {/* Sector */}
                <ListItem disableGutters>
                    <ListItemText
                        primary="Sector"
                        secondary={sector}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary' }}
                    />
                </ListItem>

                {/* Created / Modified */}
                <ListItem disableGutters>
                    <ListItemText
                        primary="Created"
                        secondary={createDate}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary' }}
                    />
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText
                        primary="Modified"
                        secondary={updateDate}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary' }}
                    />
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Owner Section */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Owner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={ownerAvatar} alt={ownerName}>
                    {ownerName.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="subtitle2">{ownerName}</Typography>
                    <Typography variant="caption" color="text.secondary">Owner</Typography>
                </Box>
            </Box>

            <List disablePadding>
                <ListItem disableGutters dense>
                    <ListItemText
                        primary="Email"
                        secondary={ownerEmail}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                </ListItem>
                <ListItem disableGutters dense>
                    <ListItemText
                        primary="Phone"
                        secondary={ownerPhone}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                </ListItem>
            </List>

        </Drawer >
    );
};

export default DocumentDetailSidebar;
