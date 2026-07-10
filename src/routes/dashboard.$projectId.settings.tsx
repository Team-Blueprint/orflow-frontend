import { useState, useEffect, type FormEvent } from "react"
import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { AxiosError } from "axios"
import { useEnv } from "@/lib/environment"
import { ApiKeysSkeleton } from "@/components/skeletons/api-keys-skeleton"

interface ProjectApiKey {
  id: string
  project_id: string
  key_type: string
  is_active: boolean
  name: string | null
  created_at: string
  updated_at: string
}

interface KeyActionResponse {
  key_type: string
  value: string
  active: boolean
  name: string | null
}

type KeyType = "pk_test" | "sk_test" | "pk_live" | "sk_live"
type SettingsTab = "general" | "api-keys"

const KEY_LABELS: Record<KeyType, string> = {
  pk_test: "Publishable key (test)",
  sk_test: "Secret key (test)",
  pk_live: "Publishable key (live)",
  sk_live: "Secret key (live)",
}

export const Route = createFileRoute("/dashboard/$projectId/settings")({
  component: ProjectSettings,
})

function ProjectSettings() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/settings" })
  const env = useEnv()
  const navigate = useNavigate()
  const [tab, setTab] = useState<SettingsTab>("general")

  // General settings state
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

  // API keys state
  const [keys, setKeys] = useState<ProjectApiKey[]>([])
  const [keysLoading, setKeysLoading] = useState(true)
  const [keyTab, setKeyTab] = useState<"test" | "live">("test")
  const [actionLoading, setActionLoading] = useState<KeyType | null>(null)
  const [keyError, setKeyError] = useState("")
  const [revealedKey, setRevealedKey] = useState<{ type: KeyType; value: string } | null>(null)

  const tabKeys: KeyType[] = keyTab === "test" ? ["pk_test", "sk_test"] : ["pk_live", "sk_live"]

  useEffect(() => {
    apiClient.get(ENDPOINTS.PROJECTS.GET(projectId))
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

  useEffect(() => {
    if (tab !== "api-keys") return
    setKeysLoading(true)
    apiClient.get<ProjectApiKey[]>(ENDPOINTS.PROJECTS.KEYS.LIST(projectId))
      .then((res) => { setKeys(res.data); setKeysLoading(false) })
      .catch(() => setKeysLoading(false))
  }, [projectId, tab])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)
    try {
      await apiClient.patch(ENDPOINTS.PROJECTS.UPDATE(projectId), {
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
      await apiClient.delete(ENDPOINTS.PROJECTS.DELETE(projectId))
      navigate({ to: "/dashboard" })
    } catch {
      setError("Failed to delete project")
      setDeleting(false)
    }
  }

  function getKeyStatus(keyType: KeyType): "none" | "active" | "revoked" {
    const key = keys.find((k) => k.key_type === keyType)
    if (!key) return "none"
    return key.is_active ? "active" : "revoked"
  }

  async function fetchFreshKeys() {
    const { data } = await apiClient.get<ProjectApiKey[]>(ENDPOINTS.PROJECTS.KEYS.LIST(projectId))
    setKeys(data)
  }

  async function handleGenerate(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      const { data } = await apiClient.post<KeyActionResponse>(ENDPOINTS.PROJECTS.KEYS.CREATE(projectId), { key_type: keyType })
      setRevealedKey({ type: keyType, value: data.value })
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to generate key")
      }
    } finally {
      setActionLoading(null)
    }
    fetchFreshKeys().catch(() => {})
  }

  async function handleRegenerate(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      const { data } = await apiClient.post<KeyActionResponse>(ENDPOINTS.PROJECTS.KEYS.REGENERATE(projectId), { key_type: keyType })
      setRevealedKey({ type: keyType, value: data.value })
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to regenerate key")
      }
    } finally {
      setActionLoading(null)
    }
    fetchFreshKeys().catch(() => {})
  }

  async function handleRevoke(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      await apiClient.post(ENDPOINTS.PROJECTS.KEYS.REVOKE(projectId), { key_type: keyType })
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to revoke key")
      }
    } finally {
      setActionLoading(null)
    }
    fetchFreshKeys().catch(() => {})
  }

  function maskKey(_value: string): string {
    return "••••••••••••••••••••••••••••••••••••••••"
  }

  const isSecret = (kt: KeyType) => kt.startsWith("sk_")

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

      {/* Tab bar */}
      <div className="flex border-b border-hairline mb-6">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            tab === "general"
              ? "text-ink border-b-2 border-primary"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setTab("api-keys")}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            tab === "api-keys"
              ? "text-ink border-b-2 border-primary"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          API Keys
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2 mb-5 sm:mb-6">{error}</p>
      )}
      {success && (
        <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-3 py-2 mb-5 sm:mb-6">{success}</p>
      )}

      {/* General tab */}
      {tab === "general" && (
        <>
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
        </>
      )}

      {/* API Keys tab */}
      {tab === "api-keys" && (
        <>
          {keyError && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2 mb-5 sm:mb-6">{keyError}</p>
          )}

          <div className="flex border-b border-hairline">
            <button
              type="button"
              onClick={() => setKeyTab("test")}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                keyTab === "test"
                  ? "text-ink border-b-2 border-primary"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Test
            </button>
            <button
              type="button"
              onClick={() => setKeyTab("live")}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                keyTab === "live"
                  ? "text-ink border-b-2 border-primary"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Live
            </button>
          </div>

          {keysLoading ? (
            <ApiKeysSkeleton />
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {tabKeys.map((keyType) => {
                const status = getKeyStatus(keyType)
                const isSecretKey = isSecret(keyType)
                const isLoading = actionLoading === keyType

                return (
                  <div key={keyType} className="border border-hairline bg-paper">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink">{KEY_LABELS[keyType]}</p>
                        {status === "none" && (
                          <p className="mt-1 text-[10px] font-mono text-ink-soft">Not created yet</p>
                        )}
                        {status !== "none" && (
                          <p className="mt-1 font-mono text-xs text-ink select-all truncate">
                            {maskKey(keyType)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {status === "none" && (
                          <button
                            type="button"
                            onClick={() => handleGenerate(keyType)}
                            disabled={isLoading}
                            className="btn-primary text-[11px] font-bold px-3 py-2 cursor-pointer disabled:opacity-50"
                            style={{ minHeight: 36 }}
                          >
                            {isLoading ? "..." : "Generate"}
                          </button>
                        )}
                        {status === "active" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(keyType)}
                              disabled={isLoading}
                              className="text-[11px] font-semibold px-3 py-2 border border-hairline bg-zinc-900/40 text-ink-soft hover:text-ink hover:border-hairline-strong transition-colors cursor-pointer disabled:opacity-50"
                              style={{ minHeight: 36 }}
                            >
                              {isLoading ? "..." : isSecretKey ? "Roll" : "Regenerate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevoke(keyType)}
                              disabled={isLoading}
                              className="text-[11px] font-semibold px-3 py-2 border border-red-900/50 text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-50"
                              style={{ minHeight: 36 }}
                            >
                              {isLoading ? "..." : "Revoke"}
                            </button>
                          </>
                        )}
                        {status === "revoked" && (
                          <>
                            <span className="text-[10px] font-mono text-red-400 bg-red-950/30 px-2 py-1">
                              Revoked
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(keyType)}
                              disabled={isLoading}
                              className="text-[11px] font-semibold px-3 py-2 border border-hairline bg-zinc-900/40 text-ink-soft hover:text-ink hover:border-hairline-strong transition-colors cursor-pointer disabled:opacity-50"
                              style={{ minHeight: 36 }}
                            >
                              {isLoading ? "..." : "Regenerate"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Reveal-once modal for secret keys */}
      {revealedKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setRevealedKey(null)}
        >
          <div
            className="w-full max-w-md border border-hairline bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-ink">Key created</h3>
            {isSecret(revealedKey.type) && (
              <p className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">
                Save this key now. You won't be able to see it again after you close this window.
              </p>
            )}
            <div className="mt-4 flex border border-hairline">
              <div className="flex-1 truncate bg-canvas px-3 py-2.5 font-mono text-xs text-ink select-all">
                {revealedKey.value}
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(revealedKey.value)}
                className="border-l border-hairline bg-midnight-soft px-3 text-xs font-medium text-ink-soft hover:text-ink transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRevealedKey(null)}
              className="btn-primary w-full text-sm font-bold py-2.5 mt-4 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
