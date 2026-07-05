export interface CustomerRead {
  id: string
  tenant_id: string
  email: string
  name: string
  activity_status: "active" | "inactive" | "suspended"
  last_seen: string | null
  created_at: string
  updated_at: string
  plan_name?: string
  card_last_four?: string
  card_brand?: string
}

export interface CustomerListResponse {
  data: CustomerRead[]
  total: number
  offset: number
  limit: number
}
