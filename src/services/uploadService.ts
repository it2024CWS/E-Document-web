import * as tus from 'tus-js-client';

const TUS_ENDPOINT = `${import.meta.env.VITE_BASE_URL}/v1/upload/files`;

export interface UploadProgressInfo {
    bytesUploaded: number;
    bytesTotal: number;
    percentage: number;
    fileName: string;
}

export interface UploadOptions {
    file: File;
    relativePath?: string;
    parentFolderId?: string;
    onProgress?: (progress: UploadProgressInfo) => void;
    onSuccess?: (uploadId: string) => void;
    onError?: (error: Error) => void;
}

/**
 * Upload a single file using TUS protocol
 */
export const uploadFile = (options: UploadOptions): tus.Upload => {
    const { file, relativePath, parentFolderId, onProgress, onSuccess, onError } = options;

    const metadata: Record<string, string> = {
        filename: file.name,
        file_type: file.type || 'application/octet-stream',
    };

    if (relativePath) {
        metadata.relative_path = relativePath;
    }

    if (parentFolderId) {
        metadata.parent_folder_id = parentFolderId;
    }

    const upload = new tus.Upload(file, {
        endpoint: TUS_ENDPOINT,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata,
        onBeforeRequest: (req) => {
            // Enable credentials to send cookies with requests
            const xhr = req.getUnderlyingObject();
            xhr.withCredentials = true;
        },
        onError: (error) => {
            console.error('Upload error:', error);
            onError?.(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            onProgress?.({
                bytesUploaded,
                bytesTotal,
                percentage,
                fileName: file.name,
            });
        },
        onSuccess: () => {
            const uploadId = upload.url?.split('/').pop() || '';
            console.log('Upload success:', uploadId);
            onSuccess?.(uploadId);
        },
    });

    upload.start();
    return upload;
};

export interface FolderUploadOptions {
    files: FileList;
    parentFolderId?: string;
    onFileProgress?: (fileName: string, progress: UploadProgressInfo) => void;
    onFileComplete?: (fileName: string) => void;
    onAllComplete?: () => void;
    onError?: (fileName: string, error: Error) => void;
}

/**
 * Upload files from a folder, preserving relative paths
 */
export const uploadFolder = (options: FolderUploadOptions): tus.Upload[] => {
    const { files, parentFolderId, onFileProgress, onFileComplete, onAllComplete, onError } = options;

    const uploads: tus.Upload[] = [];
    let completedCount = 0;
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Get relative path from webkitRelativePath
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;

        const upload = uploadFile({
            file,
            relativePath,
            parentFolderId,
            onProgress: (progress) => {
                onFileProgress?.(file.name, progress);
            },
            onSuccess: () => {
                completedCount++;
                onFileComplete?.(file.name);
                if (completedCount === totalFiles) {
                    onAllComplete?.();
                }
            },
            onError: (error) => {
                onError?.(file.name, error);
            },
        });

        uploads.push(upload);
    }

    return uploads;
};

/**
 * Cancel an upload
 */
export const cancelUpload = (upload: tus.Upload): void => {
    upload.abort();
};
