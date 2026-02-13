
import { useState } from 'react';
import {
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
    Box,
    Typography,
    Paper
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FolderModel } from '@/models/folderModel';
import { radius } from '@/themes/radius';

interface FolderTreeProps {
    folders: FolderModel[];
    selectedFolder: FolderModel | null;
    onSelect: (folder: FolderModel | null) => void;
}

interface FolderItemProps {
    folder: FolderModel;
    selectedFolder: FolderModel | null;
    onSelect: (folder: FolderModel | null) => void;
    level?: number;
}

const FolderItem = ({ folder, selectedFolder, onSelect, level = 0 }: FolderItemProps) => {
    const [open, setOpen] = useState(false);
    const hasChildren = folder.sub_folders && folder.sub_folders.length > 0;
    const isSelected = selectedFolder?.id === folder.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(folder);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                selected={isSelected}
                sx={{
                    pl: level * 2 + 2,
                    borderRadius: radius[2],
                    mb: 0.5,
                    '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': {
                            bgcolor: 'primary.light',
                        }
                    }
                }}
            >
                <ListItemIcon sx={{ minWidth: 32 }} onClick={handleToggle}>
                    {hasChildren ? (open ? <FolderOpenIcon color={isSelected ? 'primary' : 'inherit'} /> : <FolderIcon color={isSelected ? 'primary' : 'inherit'} />) : <FolderIcon color={isSelected ? 'primary' : 'inherit'} />}
                </ListItemIcon>
                <ListItemText primary={folder.name} />
                {hasChildren && (
                    <Box component="span" onClick={handleToggle} sx={{ display: 'flex', alignItems: 'center' }}>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                )}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {folder.sub_folders!.map((sub) => (
                            <FolderItem
                                key={sub.id}
                                folder={sub}
                                selectedFolder={selectedFolder}
                                onSelect={onSelect}
                                level={level + 1}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const FolderTree = ({ folders, selectedFolder, onSelect }: FolderTreeProps) => {
    return (
        <Paper sx={{ width: '100%', p: 2, borderRadius: radius[3], minHeight: '400px' }}>
            <Typography variant="h6" mb={2}>Folders</Typography>
            <List component="nav">
                <ListItemButton
                    selected={selectedFolder === null}
                    onClick={() => onSelect(null)}
                    sx={{ borderRadius: radius[2], mb: 0.5 }}
                >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Documents" />
                </ListItemButton>
                {folders.map((folder) => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        selectedFolder={selectedFolder}
                        onSelect={onSelect}
                    />
                ))}
            </List>
        </Paper>
    );
};

export default FolderTree;
