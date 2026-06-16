export interface RecipientDepartment {
  id?: string;
  department_id?: string;
  dept_name?: string;
  department_name?: string;
  status?: string; // pending|received|approved|rejected|waiting
  sequence_order?: number;
  is_current?: boolean;
  received_date?: string;
  approver_date?: string;
  incoming_doc?: {
    id: string;
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

  // Owner department head approval gate: pending|approved|rejected
  status?: string;

  // Flow tracking
  current_department?: string;
  current_status?: string; // pending|received|rejected|"" (completed)
  flow_status?: string; // pending_approval|in_progress|completed|rejected
}
