export interface IncomingDocModel {
  id: string;
  incoming_no: string;
  doc_id: string;
  doc_no: string;
  doc_name: string;
  sender_id?: string;
  sender_name?: string;
  receiver_id?: string;
  receiver_name?: string;
  approver_id?: string;
  approver_name?: string;
  received_date?: string;
  approver_date?: string;
  remark: string;
  status: 'pending' | 'received' | 'approved' | 'rejected';
  created_at: string;
  doc_path?: string;
  type?: string;
}
