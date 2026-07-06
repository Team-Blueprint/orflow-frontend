export interface SubscriptionPageRead {
  id: string
  tenant_id: string
  project_id: string | null
  plan_id: string
  code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPageWithPlanRead extends SubscriptionPageRead {
  plan_name: string
  url: string
}

export interface SubscriptionPageCreate {
  plan_id: string
}

export interface SubscriptionPageUpdate {
  plan_id?: string
  is_active?: boolean
}

export interface PublicPageInfo {
  id: string
  plan_id: string
  name: string
  amount: number
  currency: string
  interval: string
  interval_count: number
  merchant_name: string
}

export interface PublicCheckoutResponse {
  checkout_link: string
  order_reference: string
}
