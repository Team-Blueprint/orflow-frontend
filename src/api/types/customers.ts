export interface CustomerRead {
  id: string
  tenant_id: string
  email: string
  name: string
  external_id?: string | null
  created_at: string
  updated_at: string
}
