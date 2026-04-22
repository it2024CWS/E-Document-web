export interface FolderModel {
  id: string;
  folder_name: string;
  folder_path: string;
  user_id: string;
  parent_folder_id: string | null;
  created_at: string;
  updated_at?: string;
  sub_folders?: FolderModel[];
  // UI fields
  name?: string;
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
