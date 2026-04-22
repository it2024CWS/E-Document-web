export interface SectorModel {
  id: string;
  name: string;
  dept_id: string;
  dept_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSectorRequest {
  name: string;
  dept_id: string;
}

export interface UpdateSectorRequest {
  name?: string;
  dept_id?: string;
}
