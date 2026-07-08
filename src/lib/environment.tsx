import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

const STORAGE_KEY = "orflow_env"

export type EnvMode = "test" | "live"

function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("orflow_active_project_id")
}

function getEnvKey(): string {
  const projectId = getActiveProjectId()
  return projectId ? `${STORAGE_KEY}_${projectId}` : STORAGE_KEY
}

export function getStoredEnv(): EnvMode {
  if (typeof window === "undefined") return "live"
  const stored = localStorage.getItem(getEnvKey())
  if (stored === "test" || stored === "live") return stored
  return "test"
}

export function setStoredEnv(mode: EnvMode): void {
  localStorage.setItem(getEnvKey(), mode)
}

export function isTestMode(): boolean {
  return getStoredEnv() === "test"
}

interface EnvContextValue {
  mode: EnvMode
  isTest: boolean
  setMode: (mode: EnvMode) => void
}

const EnvContext = createContext<EnvContextValue | null>(null)

export function EnvProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<EnvMode>(getStoredEnv)

  useEffect(() => {
    function handleProjectChange() {
      setModeState(getStoredEnv())
    }
    window.addEventListener("orflow-project-changed", handleProjectChange)
    return () => window.removeEventListener("orflow-project-changed", handleProjectChange)
  }, [])

  const setMode = useCallback((m: EnvMode) => {
    setStoredEnv(m)
    setModeState(m)
  }, [])

  return (
    <EnvContext.Provider value={{ mode, isTest: mode === "test", setMode }}>
      {children}
    </EnvContext.Provider>
  )
}

export function useEnv(): EnvContextValue {
  const ctx = useContext(EnvContext)
  if (!ctx) throw new Error("useEnv must be used within EnvProvider")
  return ctx
}
