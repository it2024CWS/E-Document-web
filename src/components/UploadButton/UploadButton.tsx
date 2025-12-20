import { useState, useRef } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import { colors } from '@/themes/colors';
import { uploadFile, uploadFolder } from '@/services/uploadService';
import Swal from 'sweetalert2';

interface UploadButtonProps {
    parentFolderId?: string;
    onUploadComplete?: () => void;
}

const UploadButton = ({ parentFolderId, onUploadComplete }: UploadButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileUpload = () => {
        handleClose();
        fileInputRef.current?.click();
    };

    const handleFolderUpload = () => {
        handleClose();
        folderInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Show loading indicator
        Swal.fire({
            title: 'Uploading...',
            html: 'Uploading files, please wait.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        let uploadedCount = 0;
        const totalFiles = files.length;

        Array.from(files).forEach((file) => {
            uploadFile({
                file,
                parentFolderId,
                onProgress: (progress) => {
                    console.log(`${file.name}: ${progress.percentage}%`);
                },
                onSuccess: (uploadId) => {
                    uploadedCount++;
                    console.log(`Upload success: ${file.name}`, uploadId);

                    if (uploadedCount === totalFiles) {
                        Swal.close();
                        Swal.fire({
                            icon: 'success',
                            title: 'Upload Complete',
                            text: `Successfully uploaded ${totalFiles} file(s)`,
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        onUploadComplete?.();
                    }
                },
                onError: (error) => {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Upload Failed',
                        text: `Failed to upload ${file.name}: ${error.message}`,
                    });
                },
            });
        });

        // Reset input
        event.target.value = '';
    };

    const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Show loading indicator
        Swal.fire({
            title: 'Uploading Folder...',
            html: `Uploading ${files.length} files, please wait.`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        uploadFolder({
            files,
            parentFolderId,
            onFileProgress: (fileName, progress) => {
                console.log(`${fileName}: ${progress.percentage}%`);
            },
            onFileComplete: (fileName) => {
                console.log(`Completed: ${fileName}`);
            },
            onAllComplete: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Upload Complete',
                    text: `Successfully uploaded folder with ${files.length} file(s)`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                onUploadComplete?.();
            },
            onError: (fileName, error) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: `Failed to upload ${fileName}: ${error.message}`,
                });
            },
        });

        // Reset input
        event.target.value = '';
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleClick}
                startIcon={<AddIcon />}
                sx={{
                    bgcolor: colors.dominant.white1,
                    color: colors.secondary.text,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                    '&:hover': {
                        bgcolor: colors.dominant.white3,
                        boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                    },
                    borderRadius: '24px',
                    px: 3,
                    py: 1,
                }}
            >
                New
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)',
                        mt: 1,
                        minWidth: 200,
                    },
                }}
            >
                <MenuItem onClick={handleFileUpload}>
                    <ListItemIcon>
                        <UploadFileIcon fontSize="small" sx={{ color: colors.secondary.blue1 }} />
                    </ListItemIcon>
                    <ListItemText>Upload File</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleFolderUpload}>
                    <ListItemIcon>
                        <FolderIcon fontSize="small" sx={{ color: colors.accent.yellow }} />
                    </ListItemIcon>
                    <ListItemText>Upload Folder</ListItemText>
                </MenuItem>
            </Menu>

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <input
                ref={folderInputRef}
                type="file"
                {...({ webkitdirectory: '', directory: '' } as any)}
                style={{ display: 'none' }}
                onChange={handleFolderChange}
            />
        </>
    );
};

export default UploadButton;
