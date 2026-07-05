export interface Subscription {
  id: string
  plan_name: string
  customer_email: string
  customer_name: string
  amount: number
  currency: string
  status: "active" | "past_due" | "canceled" | "paused"
  interval: string
  started_at: string
  next_billing_date?: string
  ended_at?: string
  card_last_four?: string
  card_brand?: string
}
