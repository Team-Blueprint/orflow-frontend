export type DiscrepancyType =
  | "missing_in_ours"
  | "missing_in_nomba"
  | "status_mismatch"
  | "amount_mismatch"

export interface ReconciliationDiscrepancy {
  id: string
  tenant_id: string | null
  run_id: string
  nomba_transaction_id: string | null
  nomba_status: string | null
  nomba_amount: number | null
  nomba_created_at: string | null
  merchant_tx_ref: string | null
  payment_attempt_id: string | null
  invoice_id: string | null
  our_status: string | null
  our_amount: number | null
  discrepancy_type: DiscrepancyType
  details: string | null
  resolved: boolean
  resolved_at: string | null
  resolution_note: string | null
  created_at: string
}

export interface ReconciliationDiscrepancyPage {
  items: ReconciliationDiscrepancy[]
  total: number
  page: number
  per_page: number
}

export interface DiscrepancyFilterParams {
  run_id?: string
  discrepancy_type?: DiscrepancyType | ""
  resolved?: boolean | ""
  page?: number
  per_page?: number
}
