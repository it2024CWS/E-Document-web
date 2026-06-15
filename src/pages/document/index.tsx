import { Box, Typography } from '@mui/material';
import useDocumentController from './controllers/documentController';
import DocumentList from './components/DocumentList';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import DocumentCreateDialog from './components/DocumentCreateDialog';
import DocumentVersionsDialog from './components/DocumentVersionsDialog';
import DocumentEditDialog from './components/DocumentEditDialog';
import DocumentDetailSidebar from './components/DocumentDetailSidebar';
import FolderEditDialog from './components/FolderEditDialog';
import useMainDrawerControllerContext from '@/layouts/context';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DocumentPage = () => {
    const { t } = useTranslation();
    const [versionsRefreshKey, setVersionsRefreshKey] = useState(0);

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
        detailSidebarOpen,
        handleOpenDetail,
        handleCloseDetail,
        selectedDetailItem,
        handleDeleteDocument,
        refreshDocuments,
        refreshFolders,
        folderEditDialogOpen,
        selectedEditFolder,
        handleOpenEditFolder,
        handleCloseEditFolder,
    } = useDocumentController();

    const { addDocumentTrigger, consumeAddDocumentTrigger } = useMainDrawerControllerContext();

    useEffect(() => {
        if (addDocumentTrigger > 0) {
            setCreateDialogOpen(true);
            consumeAddDocumentTrigger();
        }
    }, [addDocumentTrigger, setCreateDialogOpen, consumeAddDocumentTrigger]);

    const currentFolders = useMemo(() => {
        if (!selectedFolder) {
            return folders.filter(f => !f.parent_folder_id);
        }
        return folders.filter(f => f.parent_folder_id === selectedFolder.id);
    }, [folders, selectedFolder]);

    const breadcrumbs = useMemo(() => {
        const crumbs: { label: string; onClick?: () => void }[] = [
            {
                label: t('nav.documentManagement'),
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
                path.unshift({ label: folder.folder_name || '', onClick: () => handleFolderSelect(folder) });

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
                    {selectedFolder
                        ? t('myFile.folderView', { name: selectedFolder.folder_name })
                        : t('myFile.allDocuments')}
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
                onSuccess={async () => {
                    // Wait a moment for all concurrent uploads to finish processing on the server
                    await new Promise(r => setTimeout(r, 800));
                    // Refresh folders first so newly-created sub-folders appear,
                    // then refresh documents inside the current folder
                    await refreshFolders();
                    await refreshDocuments();
                }}
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
                onSuccess={async () => {
                    await refreshDocuments();
                    setVersionsRefreshKey(k => k + 1);
                }}
                docData={selectedDocument}
                folders={folders}
                currentFolderId={selectedFolder?.id}
            />

            <FolderEditDialog
                open={folderEditDialogOpen}
                onClose={handleCloseEditFolder}
                folder={selectedEditFolder}
                onSuccess={refreshFolders}
            />

            <DocumentDetailSidebar
                open={detailSidebarOpen}
                onClose={handleCloseDetail}
                item={selectedDetailItem}
                type={selectedDetailItem && 'doc_no' in selectedDetailItem ? 'document' : 'folder'}
                onEdit={(item) => {
                    handleCloseDetail();
                    if ('doc_no' in item) {
                        handleOpenEdit(item as any);
                    } else {
                        handleOpenEditFolder(item as any);
                    }
                }}
                onDelete={handleDeleteDocument}
                versionsKey={versionsRefreshKey}
            />
        </Box>
    );
};

export default DocumentPage;
