import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "@solar-icons/react";

export const Route = createFileRoute("/portal/access/")({
  component: PortalAccessIndex,
});

function PortalAccessIndex() {
  const navigate = useNavigate();

  const customers = [
    {
      name: "Idighs Anthony",
      email: "idighs.anthony@gmail.com",
      slug: "demo-idighs-active",
    },
    {
      name: "Jamie Chukwuma",
      email: "jamie.chukwuma99@gmail.com",
      slug: "demo-jamie-paused",
    },
    {
      name: "Amadi Florence",
      email: "amadi.florence.f@gmail.com",
      slug: "demo-amadi-cards",
    },
  ];

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm sm:border sm:border-hairline sm:bg-card sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-primary/10 mb-4">
            <Lock weight="BoldDuotone" className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">
            Demo Accounts
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Select a demo customer to access the portal
          </p>
        </div>

        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.name}
              className="border border-hairline bg-muted/50 p-4 cursor-pointer hover:bg-muted transition-colors"
              onClick={() => {
                navigate({
                  to: "/portal/access/$tokenSlug",
                  params: { tokenSlug: customer.slug },
                  search: { pin: "123456", customer_name: customer.name },
                })
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {customer.name}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {customer.email}
                  </p>
                </div>
                <span className="text-xs font-medium text-ink">
                  {customer.slug.includes("active")
                    ? "ACTIVE SUBSCRIBER"
                    : customer.slug.includes("paused")
                      ? "PAUSED SUBSCRIPTION"
                      : "MULTIPLE SAVED CARDS"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border border-hairline bg-muted/50 p-3 text-center">
          <p className="text-xs font-medium text-ink">
            ENTRY PIN FOR ALL: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
