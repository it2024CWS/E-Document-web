
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { DocumentModel } from '@/models/documentModel';
import { folderService } from '@/services/folderService';
import { FolderModel } from '@/models/folderModel';
import { documentService } from '../../../services/documentService';

const useDocumentController = () => {
    const { t } = useTranslation();
    const [documents, setDocuments] = useState<DocumentModel[]>([]);
    const [folders, setFolders] = useState<FolderModel[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<FolderModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [folderLoading, setFolderLoading] = useState(false);

    // Keep a ref that always mirrors selectedFolder so async callbacks (e.g. upload
    // onAllComplete) can read the latest value without stale closure issues.
    const selectedFolderRef = useRef<FolderModel | null>(null);
    selectedFolderRef.current = selectedFolder;

    // ── Fetch folders on mount ─────────────────────────────────────────────────
    useEffect(() => {
        const fetchFolders = async () => {
            setFolderLoading(true);
            try {
                const res = await folderService.getAllFolders();
                setFolders(res.items);
            } catch (error) {
                console.error('Failed to fetch folders', error);
                setFolders([]);
            } finally {
                setFolderLoading(false);
            }
        };
        fetchFolders();
    }, []);

    // ── Fetch documents when selected folder changes ────────────────────────────
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                let items: DocumentModel[] = [];
                if (selectedFolder) {
                    const res = await documentService.getDocumentsByFolder(selectedFolder.id);
                    items = res.items;
                } else {
                    const res = await documentService.getAllDocuments();
                    items = res.items;
                }
                setDocuments(items);
            } catch (error) {
                console.error('Failed to fetch documents', error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [selectedFolder]);

    // ── Dialog states ──────────────────────────────────────────────────────────
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [versionDialogOpen, setVersionDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentModel | null>(null);

    // ── Folder edit dialog ─────────────────────────────────────────────────────
    const [folderEditDialogOpen, setFolderEditDialogOpen] = useState(false);
    const [selectedEditFolder, setSelectedEditFolder] = useState<FolderModel | null>(null);

    // ── Detail sidebar ─────────────────────────────────────────────────────────
    const [detailSidebarOpen, setDetailSidebarOpen] = useState(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState<DocumentModel | FolderModel | null>(null);

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleOpenVersionHistory = (doc: DocumentModel) => {
        setSelectedDocument(doc);
        setVersionDialogOpen(true);
    };

    const handleCloseVersionHistory = () => {
        setVersionDialogOpen(false);
        setSelectedDocument(null);
    };

    const handleOpenEdit = (doc: DocumentModel) => {
        setSelectedDocument(doc);
        setEditDialogOpen(true);
    };

    const handleCloseEdit = () => {
        setEditDialogOpen(false);
        setSelectedDocument(null);
    };

    const handleFolderSelect = (folder: FolderModel | null) => {
        setSelectedFolder(folder);
    };

    // Always reads the latest selectedFolder via ref so async upload callbacks work correctly
    const refreshDocuments = async () => {
        try {
            const currentFolder = selectedFolderRef.current;
            let items: DocumentModel[] = [];
            if (currentFolder) {
                const res = await documentService.getDocumentsByFolder(currentFolder.id);
                items = res.items;
            } else {
                const res = await documentService.getAllDocuments();
                items = res.items;
            }
            setDocuments(items);
        } catch (error) {
            console.error('Failed to refresh documents', error);
        }
    };

    const refreshFolders = async () => {
        try {
            const res = await folderService.getAllFolders();
            setFolders(res.items);
        } catch (error) {
            console.error('Failed to refresh folders', error);
        }
    };

    const handleCreateDocument = async (data: any) => {
        setLoading(true);
        try {
            await documentService.createDocument(data);
            await refreshDocuments();
        } catch (error) {
            console.error('Failed to create document', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDocument = async (id: string, data: any) => {
        setLoading(true);
        try {
            await documentService.updateDocument(id, data);
            await refreshDocuments();
        } catch (error) {
            console.error('Failed to update document', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditFolder = (folder: FolderModel) => {
        setSelectedEditFolder(folder);
        setFolderEditDialogOpen(true);
    };

    const handleCloseEditFolder = () => {
        setFolderEditDialogOpen(false);
        setSelectedEditFolder(null);
    };

    const handleOpenDetail = (item: DocumentModel | FolderModel) => {
        setSelectedDetailItem(item);
        setDetailSidebarOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailSidebarOpen(false);
        setSelectedDetailItem(null);
    };

    const handleDeleteDocument = async (item: DocumentModel | FolderModel) => {
        if (!item) return;

        const isFolder = !(item as DocumentModel).doc_no;

        const itemName = isFolder
            ? (item as FolderModel).folder_name
            : (item as DocumentModel).doc_name;

        const confirmed = await Swal.fire({
            title: t(isFolder ? 'docs.deleteFolderTitle' : 'docs.deleteDocumentTitle'),
            text: t('docs.deleteItemConfirm', { name: itemName }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('docs.deleteBtn'),
            cancelButtonText: t('common.cancel'),
        });

        if (!confirmed.isConfirmed) return;

        setLoading(true);
        try {
            if (isFolder) {
                await folderService.deleteFolder((item as FolderModel).id);
                await refreshFolders();
            } else {
                await documentService.deleteDocument((item as DocumentModel).id);
                await refreshDocuments();
            }
            handleCloseDetail();
            Swal.fire(t('docs.deleted'), t(isFolder ? 'docs.folderDeleted' : 'docs.documentDeleted'), 'success');
        } catch (error) {
            console.error('Failed to delete item', error);
            Swal.fire(t('common.error'), t('docs.deleteFailed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        documents,
        folders,
        selectedFolder,
        loading,
        folderLoading,
        handleFolderSelect,
        createDialogOpen,
        setCreateDialogOpen,
        handleCreateDocument,
        versionDialogOpen,
        selectedDocument,
        handleOpenVersionHistory,
        handleCloseVersionHistory,
        editDialogOpen,
        handleOpenEdit,
        handleCloseEdit,
        handleUpdateDocument,
        detailSidebarOpen,
        selectedDetailItem,
        handleOpenDetail,
        handleCloseDetail,
        handleDeleteDocument,
        refreshDocuments,
        refreshFolders,
        folderEditDialogOpen,
        selectedEditFolder,
        handleOpenEditFolder,
        handleCloseEditFolder,
    };
};

export default useDocumentController;
