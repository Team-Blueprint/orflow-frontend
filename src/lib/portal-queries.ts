import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PortalData, SubscriptionPageData, BillingRecord } from "./portal-data";

export const queryKeys = {
  portal: {
    subscription: (token: string) => ["portal", "subscription", token] as const,
    invoices: (token: string) => ["portal", "invoices", token] as const,
  },
  subscriptionPage: {
    byCode: (code: string) => ["subscriptionPage", code] as const,
  },
};

function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

const MOCK_PORTAL: PortalData = {
  subscription: {
    id: "sub_mock_01",
    projectId: "proj_mock",
    subscriberId: "sub_mock_01",
    planId: "plan_mock_01",
    subscriptionCode: "mock123",
    status: "active",
    amount: 29900,
    nextPaymentDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  plan: {
    id: "plan_mock_01",
    projectId: "proj_mock",
    name: "Starter Monthly",
    description: "Essential features for small teams.",
    amount: 29900,
    currency: "NGN",
    interval: "monthly",
  },
  subscriber: {
    id: "sub_mock_01",
    projectId: "proj_mock",
    email: "customer@example.com",
    name: "Jamie",
    status: "active",
    cardBrand: "Visa",
    cardLast4: "4242",
  },
  billing: [
    { id: "br_01", subscriptionId: "sub_mock_01", amount: 29900, status: "paid", date: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "br_02", subscriptionId: "sub_mock_01", amount: 29900, status: "paid", date: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: "br_03", subscriptionId: "sub_mock_01", amount: 29900, status: "paid", date: new Date(Date.now() - 90 * 86400000).toISOString() },
  ],
};

export function usePortalSubscription(token: string) {
  return useQuery({
    queryKey: queryKeys.portal.subscription(token),
    queryFn: async (): Promise<PortalData | null> => {
      await delay();
      return MOCK_PORTAL;
    },
  });
}

export function useUpdatePortalCard(token: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { brand: string; last4: string }) => {
      await delay(300);
      return { brand: input.brand, last4: input.last4 };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.portal.subscription(token) });
    },
  });
}

export function useCancelPortalSubscription(token: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(300);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.portal.subscription(token) });
    },
  });
}

export function usePausePortalSubscription(token: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(300);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.portal.subscription(token) });
    },
  });
}

export function useResumePortalSubscription(token: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(300);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.portal.subscription(token) });
    },
  });
}

const MOCK_SUBSCRIBE_PAGE: SubscriptionPageData = {
  code: "starter-monthly",
  plan: {
    id: "plan_mock_01",
    projectId: "proj_mock",
    name: "Starter Monthly",
    description: "Essential features for small teams.",
    amount: 29900,
    currency: "NGN",
    interval: "monthly",
  },
  merchant: {
    name: "Acme Corp",
  },
};

export function useSubscriptionPage(code: string) {
  return useQuery({
    queryKey: queryKeys.subscriptionPage.byCode(code),
    queryFn: async (): Promise<SubscriptionPageData | null> => {
      await delay();
      return code === "starter-monthly" ? MOCK_SUBSCRIBE_PAGE : null;
    },
  });
}

export function useCreatePortalSubscription() {
  return useMutation({
    mutationFn: async (_input: { planId: string; name: string; email: string }) => {
      await delay(500);
      return { checkoutLink: "https://nomba-checkout.example.com/checkout", orderReference: `ref_${Date.now()}` };
    },
  });
}

export function usePortalBillingHistory(token: string) {
  return useQuery({
    queryKey: queryKeys.portal.invoices(token),
    queryFn: async (): Promise<BillingRecord[]> => {
      await delay();
      return MOCK_PORTAL.billing;
    },
  });
}
