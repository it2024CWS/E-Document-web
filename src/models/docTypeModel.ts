export interface DocTypeModel {
  id: string;
  type_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocTypeRequest {
  type_name: string;
  description?: string;
}

export interface UpdateDocTypeRequest {
  type_name?: string;
  description?: string;
}
