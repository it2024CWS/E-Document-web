export interface DocumentModel {
  id: string;
  doc_no: string;
  doc_name: string;
  doc_path: string;
  type: string;
  doc_type_id: string | null;
  folder_id: string | null;
  folder_name: string | null;
  registrant_id: string;
  registrant_name: string;
  registrant_email: string;
  status: string;
  version_number: number;
  description: string;
  send_to_director: boolean;
  created_at: string;
  updated_at: string;
}

export interface VersionModel {
  id: string;
  doc_id: string;
  version_number: number;
  doc_path: string;
  created_at: string;
}

export interface CreateDocumentRequest {
  doc_name: string;
  doc_path?: string;
  doc_type_id?: string | null;
  folder_id?: string | null;
  description?: string;
  file?: File;
}

export interface UpdateDocumentRequest {
  doc_name?: string;
  doc_path?: string;
  doc_type_id?: string | null;
  folder_id?: string | null;
  description?: string;
  file?: File;
  send_to_director?: boolean;
}
