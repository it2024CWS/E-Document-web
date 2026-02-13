
import { useState, useEffect } from 'react';
import { documentService, DocumentModel } from '@/services/documentService';
import { folderService } from '@/services/folderService';
import { FolderModel } from '@/models/folderModel';

const useDocumentController = () => {
    const [documents, setDocuments] = useState<DocumentModel[]>([]);
    const [folders, setFolders] = useState<FolderModel[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<FolderModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [folderLoading, setFolderLoading] = useState(false);

    // Fetch folders on mount
    useEffect(() => {
        const fetchFolders = async () => {
            setFolderLoading(true);
            try {
                const res = await folderService.getAllFolders();
                // Merge real folders with mock folders if needed, or just use mocks if empty
                // MOCK DATA for Folders
                const mockFolders: FolderModel[] = [
                    { id: 'f1', name: 'Test document folder 1', updated_at: '2023-03-01', parent_id: null },
                    { id: 'f2', name: 'Test document folder 2', updated_at: '2023-03-01', parent_id: null },
                    { id: 'f3', name: 'Test document folder 3', updated_at: '2023-03-01', parent_id: null },
                    { id: 'f4', name: 'Test document folder 4', updated_at: '2023-03-01', parent_id: null },
                    { id: 'f5', name: 'Test document folder 5', updated_at: '2023-03-01', parent_id: null },
                ];
                setFolders([...res, ...mockFolders]);
            } catch (error) {
                console.error("Failed to fetch folders", error);
                // Fallback to mocks on error
                setFolders([
                    { id: 'f1', name: 'Test document folder 1', updated_at: '2023-03-01', parent_id: null },
                    { id: 'f2', name: 'Test document folder 2', updated_at: '2023-03-01', parent_id: null },
                ]);
            } finally {
                setFolderLoading(false);
            }
        };
        fetchFolders();
    }, []);

    // Fetch documents when selected folder changes
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                let res: DocumentModel[] = [];
                if (selectedFolder) {
                    // Only mock for root or specific folders if we want structure, 
                    // but for now let's just show some docs in root if no folder selected, 
                    // or empty if folder selected (but maybe we want to allow navigation into mock folders?)
                    // If we navigate into a mock folder (e.g. f1), we should probably show some mock files there too.
                    try {
                        res = await documentService.getDocumentsByFolder(selectedFolder.id);
                    } catch (e) { console.log('Fetch failed, using mocks'); }
                } else {
                    try {
                        res = await documentService.getAllDocuments();
                    } catch (e) { console.log('Fetch failed, using mocks'); }
                }

                // MOCK DATA for Documents
                const mockDocs: DocumentModel[] = [
                    {
                        id: 'd1', doc_no: 'LAL20230301001', doc_name: 'Test document.xlsx', version_number: 1,
                        doc_type_id: 1, user_id: 'u1', user_name: 'John Doe', department_name: 'IT Department',
                        status: 'General', created_at: '2023-03-01', updated_at: '2023-03-01',
                        folder_id: undefined,
                        // Sidebar mock
                        sector: 'Software Development',
                        user_email: 'john.doe@company.com',
                        user_phone: '+856 20 5555 1234',
                    },
                    {
                        id: 'd2', doc_no: 'LAL20230301002', doc_name: 'Test document.pdf', version_number: 1,
                        doc_type_id: 2, user_id: 'u1', user_name: 'Jane Smith', department_name: 'HR Department',
                        status: 'Pending', created_at: '2023-03-01', updated_at: '2023-03-01',
                        folder_id: undefined,
                        // Sidebar mock
                        sector: 'Recruitment',
                        user_email: 'jane.smith@company.com',
                        user_phone: '+856 20 7777 9999',
                    },
                    {
                        id: 'd3', doc_no: 'LAL20230301003', doc_name: 'Test document.docx', version_number: 1,
                        doc_type_id: 3, user_id: 'u1', user_name: 'John Doe', department_name: 'IT Department',
                        status: 'Approved', created_at: '2023-03-01', updated_at: '2023-03-01',
                        folder_id: undefined,
                        // Sidebar mock
                        sector: 'Network Ops',
                        user_email: 'john.doe@company.com',
                        user_phone: '+856 20 5555 1234',
                    },
                ];

                // If we are in a mock folder, show these mock docs
                if (selectedFolder && selectedFolder.id.startsWith('f')) {
                    setDocuments(mockDocs);
                } else if (!selectedFolder) {
                    // Root: show real + mock
                    setDocuments([...res, ...mockDocs]);
                } else {
                    // Real folder: show real
                    setDocuments(res);
                }

            } catch (error) {
                console.error("Failed to fetch documents", error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [selectedFolder]);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [versionDialogOpen, setVersionDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentModel | null>(null);

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

    // ... existing useEffects ...

    const handleCreateDocument = async (data: any) => {
        setLoading(true);
        try {
            await documentService.createDocument(data);
            // Refresh list
            refreshDocuments();
        } catch (error) {
            console.error("Failed to create document", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDocument = async (id: string, data: any) => {
        setLoading(true);
        try {
            await documentService.updateDocument(id, data);
            refreshDocuments();
        } catch (error) {
            console.error("Failed to update document", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshDocuments = async () => {
        if (selectedFolder) {
            const res = await documentService.getDocumentsByFolder(selectedFolder.id);
            setDocuments(res);
        } else {
            const res = await documentService.getAllDocuments();
            setDocuments(res);
        }
    };

    const [detailSidebarOpen, setDetailSidebarOpen] = useState(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState<DocumentModel | FolderModel | null>(null);

    const handleOpenDetail = (item: DocumentModel | FolderModel) => {
        setSelectedDetailItem(item);
        setDetailSidebarOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailSidebarOpen(false);
        setSelectedDetailItem(null);
    };

    const handleDeleteDocument = async (doc: DocumentModel | FolderModel) => {
        if (!doc) return;
        setLoading(true);
        try {
            // Check if it's a folder or doc based on some property, e.g., 'sub_folders' or 'doc_no'
            if ((doc as DocumentModel).doc_no) {
                await documentService.deleteDocument(doc.id);
            } else {
                // await folderService.deleteFolder(doc.id);
            }
            refreshDocuments();
            handleCloseDetail();
        } catch (error) {
            console.error("Failed to delete item", error);
        } finally {
            setLoading(false);
        }
    };

    // ... existing useEffects ...

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
        // Detail Sidebar
        detailSidebarOpen,
        selectedDetailItem,
        handleOpenDetail,
        handleCloseDetail,
        handleDeleteDocument
    };
};

export default useDocumentController;
