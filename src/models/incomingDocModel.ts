export interface IncomingDocModel {
  id: string;
  doc_details_id: string;
  doc_no: string;
  doc_name: string;
  created_by?: string;
  creator_name?: string;
  updated_by?: string;
  updater_name?: string;
  approver_id?: string;
  approver_name?: string;
  incoming_date?: string;
  received_date?: string;
  approver_date?: string;
  remark: string;
  status: 'pending' | 'received' | 'approved' | 'rejected';
  updated_at: string;
  doc_path?: string;
  type?: string;
  file_type?: string; // File extension (e.g., "pdf", "docx")
  dept_id?: string;
  dept_name?: string;
}
