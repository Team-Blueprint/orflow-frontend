export const EVENT_TYPES = [
  "subscription.created",
  "subscription.activated",
  "subscription.cancelled",
  "subscription.suspended",
  "subscription.reactivated",
  "subscription.charge_success",
  "subscription.charge_failed",
  "subscription.dunning_started",
] as const;

export type EventType = typeof EVENT_TYPES[number];

export function formatEventType(type: string): string {
  return type.replace("subscription.", "");
}
