import { useState, useEffect, type FormEvent } from "react"
import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router"
import { apiClient } from "@/api/apiClient"
import { AxiosError } from "axios"
import { useEnv } from "@/lib/environment"

export const Route = createFileRoute("/dashboard/$projectId/settings")({
  component: ProjectSettings,
})

function ProjectSettings() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/settings" })
  const env = useEnv()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [defaultCallbackUrl, setDefaultCallbackUrl] = useState("")
  const [originalName, setOriginalName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    apiClient.get(`/v1/projects/${projectId}`)
      .then((res) => {
        setName(res.data.name)
        setDescription(res.data.description || "")
        setDefaultCallbackUrl(res.data.default_callback_url || "")
        setOriginalName(res.data.name)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load project")
        setLoading(false)
      })
  }, [projectId])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)
    try {
      await apiClient.patch(`/v1/projects/${projectId}/update`, {
        name,
        description: description || null,
        default_callback_url: defaultCallbackUrl || null,
      })
      setOriginalName(name)
      setSuccess("Project updated")
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Failed to update project")
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await apiClient.delete(`/v1/projects/${projectId}/del`)
      navigate({ to: "/dashboard" })
    } catch {
      setError("Failed to delete project")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Project Settings</h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
              Manage &ldquo;{originalName}&rdquo;
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Project name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="callback" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Default callback URL
              </label>
              <input
                id="callback"
                type="url"
                value={defaultCallbackUrl}
                onChange={(e) => setDefaultCallbackUrl(e.target.value)}
                placeholder="https://example.com/payment/callback"
                className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
              />
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Used when creating subscriptions via API without providing a callback URL. Subscription pages always redirect customers to the Orflow portal.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{error}</p>
            )}
            {success && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-3 py-2">{success}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full text-sm font-bold py-3 mt-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
              Environment
            </h2>
            <div className="mt-4 border border-hairline bg-paper p-4 max-w-lg">
              <div className="flex gap-1 p-0.5 bg-zinc-900/60 border border-hairline w-fit">
                <button
                  type="button"
                  onClick={() => env.setMode("test")}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    env.mode === "test"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-ink-soft hover:text-ink border border-transparent"
                  }`}
                >
                  Test
                </button>
                <button
                  type="button"
                  onClick={() => env.setMode("live")}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    env.mode === "live"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "text-ink-soft hover:text-ink border border-transparent"
                  }`}
                >
                  Live
                </button>
              </div>
              <p className="mt-3 text-[11px] text-ink-soft leading-relaxed">
                {env.mode === "test"
                  ? "Test payments without processing real transactions. All data is isolated from your live environment."
                  : "Charge real customers. Data in live mode is completely separate from sandbox data."}
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-red-400">
              Danger zone
            </h2>
            <div className="mt-4 border border-red-900/50 bg-red-950/10 p-4 max-w-lg">
              <p className="text-xs text-ink-soft">
                Deleting this project will remove all associated resources. This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 text-xs font-bold px-3 py-2 border border-red-900/50 text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  style={{ minHeight: 36 }}
                >
                  Delete project
                </button>
              ) : (
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <p className="text-xs text-red-400 font-semibold">Are you sure?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-xs font-bold px-3 py-2 bg-red-900/50 border border-red-700 text-red-200 hover:bg-red-900/70 transition-colors cursor-pointer disabled:opacity-50"
                      style={{ minHeight: 36 }}
                    >
                      {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs px-3 py-2 border border-hairline text-ink-soft hover:text-ink transition-colors cursor-pointer"
                      style={{ minHeight: 36 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
  )
}
