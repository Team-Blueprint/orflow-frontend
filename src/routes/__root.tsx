import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ToastProvider } from "@/components/webhooks/utils/toast"
import { EnvProvider } from "@/lib/environment"
import "../index.css"

export const Route = createRootRoute({
  component: () => (
    <EnvProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </EnvProvider>
  ),
})
