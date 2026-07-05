import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ToastProvider } from "@/components/webhooks/utils/toast"
import "../index.css"

export const Route = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
})
