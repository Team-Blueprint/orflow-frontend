import { createFileRoute } from "@tanstack/react-router"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiKeyField } from "@/components/api-key-field"

export const Route = createFileRoute("/dashboard/$projectId/settings")({
  component: Settings,
})

function Settings() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Manage your project and API keys
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
            Project
          </h2>
          <div className="mt-4 border border-hairline bg-paper p-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-ink-soft">Name</span>
              <span className="text-sm text-ink">My SaaS App</span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-xs text-ink-soft">Environment</span>
              <span className="text-sm text-ink">Sandbox</span>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
            API Keys
          </h2>
          <p className="mt-1 text-xs text-ink-soft">
            Use these keys to authenticate requests to the Orflow API.
          </p>
          <div className="mt-4 flex flex-col gap-5">
            <ApiKeyField
              label="Secret key"
              value="sk_test_4f3c2a1b8d7e6f5c"
              prefix="sk_test_"
            />
            <ApiKeyField
              label="Publishable key"
              value="pk_test_8d7e6f5c4f3c2a1b"
              prefix="pk_test_"
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
