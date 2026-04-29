export interface OutgoingDocModel {
  id: string;
  outgoing_no: string;
  doc_id: string;
  doc_no: string;
  doc_name: string;
  user_id?: string;
  user_name?: string;
  created_at: string;
  doc_path?: string;
  type?: string;
  incoming_docs?: any[];
}
