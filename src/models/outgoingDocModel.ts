export interface RecipientDepartment {
  id?: string;
  department_id?: string;
  dept_name?: string;
  department_name?: string;
  status?: string;
  incoming_no?: string;
  received_date?: string;
  approver_date?: string;
  incoming_doc?: {
    id: string;
    incoming_no: string;
    status: string;
    received_date?: string;
    approver_date?: string;
  };
}

export interface StatusCounts {
  total: number;
  pending: number;
  received: number;
  approved: number;
  rejected: number;
}

export interface OutgoingDocModel {
  id: string;
  outgoing_no: string;
  doc_id?: string;
  doc_no?: string;
  doc_name: string;
  user_id?: string;
  user_name?: string;
  creator_name?: string;
  created_by?: string;
  created_at: string;
  doc_path?: string;
  type?: string;
  file_type?: string;
  // Legacy support
  incoming_docs?: any[];
  // New fields
  recipients?: RecipientDepartment[];
  status_counts?: StatusCounts;
}
