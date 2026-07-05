export interface PaymentLink {
  id: string
  plan_id: string
  plan_name: string
  slug: string
  url: string
  status: "active" | "expired"
  total_visits: number
  created_at: string
  updated_at: string
}
