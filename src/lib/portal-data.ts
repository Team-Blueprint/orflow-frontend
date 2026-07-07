export interface PortalSubscription {
  id: string;
  projectId: string;
  subscriberId: string;
  planId: string;
  subscriptionCode: string;
  status: "active" | "cancelled" | "past_due" | "trialing" | "paused" | "dunning" | "suspended";
  amount: number;
  nextPaymentDate: string;
  createdAt: string;
}

export interface PortalPlan {
  id: string;
  projectId: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
}

export interface PortalSubscriber {
  id: string;
  projectId: string;
  email: string;
  name: string;
  status: string;
  cardBrand: string | null;
  cardLast4: string | null;
}

export interface BillingRecord {
  id: string;
  subscriptionId: string;
  amount: number;
  status: "paid" | "failed";
  date: string;
}

export interface PortalData {
  subscription: PortalSubscription;
  plan: PortalPlan;
  subscriber: PortalSubscriber;
  billing: BillingRecord[];
}

export interface SubscriptionPageData {
  code: string;
  is_test: boolean;
  plan: {
    id: string;
    projectId: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    interval: string;
  };
  merchant: {
    name: string;
  };
}

export function formatAmount(amount: number): string {
  return (amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
