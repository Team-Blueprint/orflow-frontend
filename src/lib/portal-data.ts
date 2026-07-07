export interface PortalSubscriptionRead {
  subscription_id: string
  plan_name: string
  status: string
  amount: number
  currency: string
  next_charge_date: string | null
  card_last4: string | null
  card_brand: string | null
}

export interface PortalPaymentRead {
  date: string
  amount: number
  currency: string
  status: string
}

export interface SubscriptionPageData {
  code: string
  is_test: boolean
  plan: {
    id: string
    projectId: string
    name: string
    description: string
    amount: number
    currency: string
    interval: string
  }
  merchant: {
    name: string
  }
}

export function formatAmount(amount: number): string {
  return (amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
