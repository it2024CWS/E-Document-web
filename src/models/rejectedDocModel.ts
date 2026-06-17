// A unified rejected-document report row. `source` distinguishes an inbound
// rejection (incoming doc rejected by a receiving department) from an outbound
// one (outgoing doc rejected by the owner department head).
export interface RejectedDocModel {
  source: 'inbound' | 'outbound';
  id: string;
  doc_no: string;
  doc_name: string;
  doc_path?: string;
  file_type?: string;
  dept_id?: string;
  dept_name?: string;
  rejected_by_id?: string;
  rejected_by?: string;
  rejected_at?: string;
  remark?: string;
}
