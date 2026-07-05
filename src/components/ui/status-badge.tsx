import { Badge } from "@/components/ui/badge";

const variantMap: Record<string, "success" | "muted" | "destructive" | "info"> = {
  active: "success",
  cancelled: "muted",
  past_due: "destructive",
  trialing: "info",
  paused: "muted",
  archived: "muted",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={variantMap[status] ?? "muted"}>
      {status.replace("_", " ")}
    </Badge>
  );
}
