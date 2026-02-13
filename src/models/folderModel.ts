
export interface FolderModel {
    id: string;
    name: string;
    parent_id?: string | null;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    sub_folders?: FolderModel[];
    // Extra details for sidebar
    user_id?: string;
    user_name?: string;
    user_email?: string;
    user_phone?: string;
    user_avatar?: string;
    sector?: string;
    department_name?: string;
}

export interface CreateFolderRequest {
    name: string;
    parent_id?: string | number;
}

export interface UpdateFolderRequest {
    name?: string;
    parent_id?: string | number;
}
