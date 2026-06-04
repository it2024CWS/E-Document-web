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
    targetModule?: string;
    extraMetadata?: Record<string, string>;
    onProgress?: (progress: UploadProgressInfo) => void;
    onSuccess?: (uploadId: string) => void;
    onError?: (error: Error) => void;
}

/**
 * Upload a single file using TUS protocol
 */
export const uploadFile = (options: UploadOptions): tus.Upload => {
    const { file, relativePath, parentFolderId, targetModule, extraMetadata, onProgress, onSuccess, onError } = options;

    const metadata: Record<string, string> = {
        filename: file.name,
        file_type: file.type || 'application/octet-stream',
        ...extraMetadata,
    };

    if (relativePath) {
        metadata.relative_path = relativePath;
    }

    if (parentFolderId) {
        metadata.parent_folder_id = parentFolderId;
    }

    if (targetModule) {
        metadata.target_module = targetModule;
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
 * Upload files from a folder, preserving relative paths.
 * Uses a concurrency limit to avoid hitting server rate limits.
 */
export const uploadFolder = (options: FolderUploadOptions): void => {
    const { files, parentFolderId, onFileProgress, onFileComplete, onAllComplete, onError } = options;

    const CONCURRENCY_LIMIT = 5; // max simultaneous uploads
    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    let completedCount = 0;
    let startedCount = 0;

    const startNext = () => {
        if (startedCount >= totalFiles) return;

        const file = fileArray[startedCount++];
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;

        uploadFile({
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
                } else {
                    // Free up the slot and start the next file
                    startNext();
                }
            },
            onError: (error) => {
                completedCount++;
                onError?.(file.name, error);
                if (completedCount === totalFiles) {
                    onAllComplete?.();
                } else {
                    // Still free the slot so remaining files can upload
                    startNext();
                }
            },
        });
    };

    // Seed the initial batch up to CONCURRENCY_LIMIT
    const initialBatch = Math.min(CONCURRENCY_LIMIT, totalFiles);
    for (let i = 0; i < initialBatch; i++) {
        startNext();
    }
};


/**
 * Upload a single file using TUS protocol and return a Promise.
 * Resolves with the tusd upload ID on success.
 */
export const uploadSingleFile = (options: UploadOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        uploadFile({
            ...options,
            onSuccess: (uploadId) => {
                options.onSuccess?.(uploadId);
                resolve(uploadId);
            },
            onError: (error) => {
                options.onError?.(error);
                reject(error);
            },
        });
    });
};

/**
 * Cancel an upload
 */
export const cancelUpload = (upload: tus.Upload): void => {
    upload.abort();
};
