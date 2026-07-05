export const ENDPOINTS = {
  HEALTH: "/",
  AUTH: {
    SIGNUP: "/v1/auth/signup",
    SIGNIN: "/v1/auth/signin",
    REFRESH: "/v1/auth/refresh",
    LOGOUT: "/v1/auth/logout",
    ME: "/v1/auth/me",
    KEYS: {
      GET: "/v1/auth/keys/new",
      CREATE: "/v1/auth/keys/create",
      REGENERATE: "/v1/auth/keys/regenerate",
      REVOKE: "/v1/auth/keys/revoke",
    },
  },
  CUSTOMERS: {
    CREATE: "/v1/customers/create",
    LIST: "/v1/customers/all",
    GET: (customerId: string) => `/v1/customers/${customerId}`,
    UPDATE: (customerId: string) => `/v1/customers/${customerId}/update`,
    DELETE: (customerId: string) => `/v1/customers/${customerId}/del`,
  },
  PLANS: {
    CREATE: "/v1/plans/create",
    LIST: "/v1/plans/list",
    GET: (planId: string) => `/v1/plans/${planId}`,
    UPDATE: (planId: string) => `/v1/plans/${planId}/update`,
    ARCHIVE: (planId: string) => `/v1/plans/${planId}/archive`,
  },
  PAYMENT_METHODS: {
    CREATE: "/v1/payment-methods/create",
    LIST_BY_CUSTOMER: (customerId: string) => `/v1/payment-methods/customer/${customerId}`,
    GET: (paymentMethodId: string) => `/v1/payment-methods/${paymentMethodId}/get`,
    UPDATE: (paymentMethodId: string) => `/v1/payment-methods/${paymentMethodId}/update`,
    SET_DEFAULT: (paymentMethodId: string) => `/v1/payment-methods/${paymentMethodId}/set-default`,
    DELETE: (paymentMethodId: string) => `/v1/payment-methods/${paymentMethodId}/del`,
  },
  SUBSCRIPTIONS: {
    CREATE: "/v1/subscriptions/create",
    LIST: "/v1/subscriptions/list",
    GET: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}`,
    CANCEL: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}/cancel`,
    PAUSE: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}/pause`,
    RESUME: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}/resume`,
    CHANGE_PLAN: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}/change-plan`,
    AUDIT_LOG: (subscriptionId: string) => `/v1/subscriptions/${subscriptionId}/audit-log`,
  },
  WEBHOOKS: {
    INBOUND: {
      NOMBA: "/v1/webhooks/inbound/nomba",
    },
    OUTBOUND: {
      ENDPOINTS: {
        CREATE: "/v1/webhooks/endpoints/add",
        LIST: "/v1/webhooks/endpoints/all",
        DELETE: (endpointId: string) => `/v1/webhooks/endpoints/${endpointId}`,
      },
      EVENTS: {
        LIST: "/v1/webhooks/events/all",
        DELIVERIES: (eventId: string) => `/v1/webhooks/events/${eventId}/deliveries`,
        CATALOG: "/v1/webhooks/events/catalog",
      },
    },
  },
  PROJECTS: {
    CREATE: "/v1/projects/create",
    LIST: "/v1/projects/list",
    GET: (projectId: string) => `/v1/projects/${projectId}`,
    UPDATE: (projectId: string) => `/v1/projects/${projectId}/update`,
    DELETE: (projectId: string) => `/v1/projects/${projectId}/del`,
  },
  ANALYTICS: {
    GET: (projectId: string) => `/v1/projects/${projectId}/analytics`,
  },
  PAYMENT_LINKS: {
    CREATE: "/v1/payment-links/create",
    LIST: "/v1/payment-links/list",
    GET: (linkId: string) => `/v1/payment-links/${linkId}`,
    DELETE: (linkId: string) => `/v1/payment-links/${linkId}/del`,
  },
  RECONCILIATION: {
    DISCREPANCIES: {
      LIST: "/v1/reconciliation/discrepancies",
      RESOLVE: (discrepancyId: string) => `/v1/reconciliation/discrepancies/${discrepancyId}/resolve`,
    },
  },
} as const;
