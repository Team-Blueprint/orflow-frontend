export interface Subscription {
  id: string
  tenant_id: string
  customer_id: string
  plan_id: string
  payment_method_id: string | null
  status: "incomplete" | "trialing" | "active" | "past_due" | "unpaid" | "paused" | "canceled" | "incomplete_expired" | "defaulted" | "completed"
  type: "recurring" | "installment"
  current_period_start: string | null
  current_period_end: string | null
  trial_end: string | null
  canceled_at: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string

  plan_name?: string
  customer_email?: string
  customer_name?: string
  amount?: number
  currency?: string
  plan?: { name: string; amount: number; currency: string }
  customer?: { id: string; email: string; name: string; external_id: string | null }
}

export interface AuditLogEntry {
  id: string
  entity_id: string
  old_status: string | null
  new_status: string | null
  reason: string | null
  actor: string
  created_at: string
}
