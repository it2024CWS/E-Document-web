
// FolderModel matches the backend FolderResponse shape
export interface FolderModel {
    id: string;
    folder_name: string;
    folder_path: string;
    user_id?: string;
    parent_folder_id?: string | null;
    created_at?: string;
    // Alias so DocumentList doesn't need changes yet
    name?: string;         // set to folder_name by adapter
    updated_at?: string;   // not in BE response but used in UI
    sub_folders?: FolderModel[];
}

export interface CreateFolderRequest {
    folder_name: string;
    folder_path: string;
    parent_folder_id?: string | null;
}

export interface UpdateFolderRequest {
    folder_name?: string;
    folder_path?: string;
    parent_folder_id?: string | null;
}

// Adapter: fill in UI convenience fields from backend shape
export function adaptFolder(f: FolderModel): FolderModel {
    return {
        ...f,
        name: f.folder_name,
        updated_at: f.created_at,
    };
}
