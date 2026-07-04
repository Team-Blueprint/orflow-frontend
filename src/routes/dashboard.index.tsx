import { useEffect, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account-layout"
import { ProjectCard } from "@/components/project-card"
import { ProjectGridSkeleton } from "@/components/skeletons/project-grid-skeleton"
import { ApiKeysSkeleton } from "@/components/skeletons/api-keys-skeleton"
import { apiClient } from "@/api/apiClient"
import { AxiosError } from "axios"

interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

interface ApiKeys {
  pk_test: string | null
  sk_test: string | null
  pk_live: string | null
  sk_live: string | null
  pk_test_active: boolean
  sk_test_active: boolean
  pk_live_active: boolean
  sk_live_active: boolean
}

type KeyType = "pk_test" | "sk_test" | "pk_live" | "sk_live"

const KEY_LABELS: Record<KeyType, string> = {
  pk_test: "Publishable key (test)",
  sk_test: "Secret key (test)",
  pk_live: "Publishable key (live)",
  sk_live: "Secret key (live)",
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})

function DashboardHome() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [keys, setKeys] = useState<ApiKeys | null>(null)
  const [keysLoading, setKeysLoading] = useState(true)
  const [revealedKey, setRevealedKey] = useState<{ type: KeyType; value: string } | null>(null)
  const [actionLoading, setActionLoading] = useState<KeyType | null>(null)
  const [keyError, setKeyError] = useState("")

  useEffect(() => {
    apiClient.get<Project[]>("/v1/projects/list")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    apiClient.get<ApiKeys>("/v1/auth/keys/new")
      .then((res) => { setKeys(res.data); setKeysLoading(false) })
      .catch(() => setKeysLoading(false))
  }, [])

  async function fetchFreshKeys() {
    const { data } = await apiClient.get<ApiKeys>("/v1/auth/keys/new")
    setKeys(data)
  }

  async function handleGenerate(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      const { data } = await apiClient.post("/v1/auth/keys/create", { key_type: keyType })
      setRevealedKey({ type: keyType, value: data.value })
      await fetchFreshKeys()
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to generate key")
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRegenerate(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      const { data } = await apiClient.post("/v1/auth/keys/regenerate", { key_type: keyType })
      setRevealedKey({ type: keyType, value: data.value })
      await fetchFreshKeys()
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to regenerate key")
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRevoke(keyType: KeyType) {
    setActionLoading(keyType)
    setKeyError("")
    try {
      await apiClient.post("/v1/auth/keys/revoke", { key_type: keyType })
      await fetchFreshKeys()
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setKeyError(err.response.data.error.message)
      } else {
        setKeyError(err?.response?.data?.detail || "Failed to revoke key")
      }
    } finally {
      setActionLoading(null)
    }
  }

  function getKeyStatus(keyType: KeyType): "none" | "active" | "revoked" {
    if (!keys) return "none"
    const value = keys[keyType]
    const active = keys[`${keyType}_active` as keyof ApiKeys] as boolean
    if (!value) return "none"
    return active ? "active" : "revoked"
  }

  function maskKey(value: string): string {
    const idx = value.indexOf("_")
    const prefix = value.slice(0, idx + 1)
    return prefix + "•".repeat(Math.max(value.length - prefix.length, 8))
  }

  const isSecret = (kt: KeyType) => kt.startsWith("sk_")

  const [keyTab, setKeyTab] = useState<"test" | "live">("test")
  const tabKeys: KeyType[] = keyTab === "test" ? ["pk_test", "sk_test"] : ["pk_live", "sk_live"]

  return (
    <AccountLayout breadcrumb="Dashboard">
      <div className="mx-auto max-w-5xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
        {/* Projects section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Projects</h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
              Select a project to manage subscriptions, plans, and webhooks
            </p>
          </div>
          <Link
            to="/dashboard/new"
            className="btn-primary text-sm font-bold px-4 py-2.5 cursor-pointer text-center"
          >
            New project
          </Link>
        </div>

        {loading && <ProjectGridSkeleton />}

        {error && (
          <p className="mt-6 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <p className="mt-5 text-sm text-ink-soft max-w-xs text-center leading-relaxed">
              No projects yet. Click &lsquo;New project&rsquo; above to initialize your first workspace.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Developer Settings / API Keys section */}
        <section className="mt-16 pt-16 border-t border-hairline">
          <h2 className="text-xl font-bold tracking-tight text-ink">Developer Settings</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Manage API credentials for your Orflow integration
          </p>

          {/* Tab bar */}
          <div className="mt-6 flex border-b border-hairline">
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

          {keyError && (
            <p className="mt-6 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{keyError}</p>
          )}

          {keysLoading ? (
            <ApiKeysSkeleton />
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {tabKeys.map((keyType) => {
                const status = getKeyStatus(keyType)
                const val = keys?.[keyType]
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
                        {status !== "none" && val && (
                          <p className="mt-1 font-mono text-xs text-ink select-all truncate">
                            {maskKey(val)}
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
                            <span className="text-[10px] font-mono text-red-400 bg-red-950/30 px-2 py-1">Revoked</span>
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
        </section>
      </div>

      {/* Reveal-once modal for secret keys */}
      {revealedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setRevealedKey(null)}>
          <div className="w-full max-w-md border border-hairline bg-paper p-6" onClick={(e) => e.stopPropagation()}>
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
    </AccountLayout>
  )
}
