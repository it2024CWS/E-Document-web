import { Box, Typography } from '@mui/material';
import useDocumentController from './controllers/documentController';
import DocumentList from './components/DocumentList';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import DocumentCreateDialog from './components/DocumentCreateDialog';
import DocumentVersionsDialog from './components/DocumentVersionsDialog';
import DocumentEditDialog from './components/DocumentEditDialog';
import DocumentDetailSidebar from './components/DocumentDetailSidebar';
import useMainDrawerControllerContext from '@/layouts/context';
import { useEffect, useMemo } from 'react';

const DocumentPage = () => {
    const {
        documents,
        folders,
        selectedFolder,
        loading,
        handleFolderSelect,
        createDialogOpen,
        setCreateDialogOpen,
        handleCreateDocument,
        versionDialogOpen,
        handleCloseVersionHistory,
        selectedDocument,
        editDialogOpen,
        handleOpenEdit,
        handleCloseEdit,
        handleUpdateDocument,
        detailSidebarOpen,
        handleOpenDetail,
        handleCloseDetail,
        selectedDetailItem,
        handleDeleteDocument
    } = useDocumentController();

    const { addDocumentTrigger } = useMainDrawerControllerContext();

    useEffect(() => {
        if (addDocumentTrigger > 0) {
            setCreateDialogOpen(true);
        }
    }, [addDocumentTrigger, setCreateDialogOpen]);

    const currentFolders = useMemo(() => {
        if (!selectedFolder) {
            return folders.filter(f => !f.parent_folder_id);
        }
        return folders.filter(f => f.parent_folder_id === selectedFolder.id);
    }, [folders, selectedFolder]);

    const breadcrumbs = useMemo(() => {
        const crumbs: { label: string; onClick?: () => void }[] = [
            {
                label: 'Document Management',
                onClick: () => handleFolderSelect(null)
            }
        ];

        if (selectedFolder) {
            const path: { label: string; onClick?: () => void }[] = [];
            let current = selectedFolder;
            while (current) {
                // Must capture current value in closure or use let, but standard closure issue applies
                // We create a new scope for each iteration or just pass the object directly
                const folder = current;
                path.unshift({ label: folder.name || '', onClick: () => handleFolderSelect(folder) });

                const parent = folders.find(f => f.id === folder.parent_folder_id);
                if (!parent) break;
                current = parent;
            }
            return [...crumbs, ...path];
        }
        return crumbs;
    }, [selectedFolder, folders, handleFolderSelect]);

    return (
        <Box>
            <BreadcrumbsCustom
                breadcrumbs={breadcrumbs}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    {selectedFolder ? `Folder: ${selectedFolder.name}` : 'All Documents'}
                </Typography>
            </Box>

            <DocumentList
                documents={documents}
                folders={currentFolders}
                loading={loading}
                onFolderClick={handleFolderSelect}
                onDelete={handleDeleteDocument}
                onDetail={handleOpenDetail}
            />

            <DocumentCreateDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSubmit={handleCreateDocument}
                folders={folders}
                currentFolderId={selectedFolder?.id}
            />

            <DocumentVersionsDialog
                open={versionDialogOpen}
                onClose={handleCloseVersionHistory}
                documentId={selectedDocument?.id || ''}
                documentTitle={selectedDocument?.doc_name || ''}
            />

            <DocumentEditDialog
                open={editDialogOpen}
                onClose={handleCloseEdit}
                onUpdate={handleUpdateDocument}
                docData={selectedDocument}
                folders={folders}
            />

            <DocumentDetailSidebar
                open={detailSidebarOpen}
                onClose={handleCloseDetail}
                item={selectedDetailItem}
                type={selectedDetailItem && 'doc_no' in selectedDetailItem ? 'document' : 'folder'}
                onEdit={(item) => {
                    handleCloseDetail();
                    // Assuming onEdit can handle DocumentModel, if it's a folder we might need a separate handler
                    if ('doc_no' in item) {
                        handleOpenEdit(item as any);
                    } else {
                        // Handle folder edit if implemented
                    }
                }}
                onDelete={handleDeleteDocument}
            />
        </Box>
    );
};

export default DocumentPage;
