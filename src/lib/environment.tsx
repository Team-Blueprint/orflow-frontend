import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

const STORAGE_KEY = "orflow_env"

export type EnvMode = "test" | "live"

export function getStoredEnv(): EnvMode {
  if (typeof window === "undefined") return "live"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "test" || stored === "live") return stored
  return "test"
}

export function setStoredEnv(mode: EnvMode): void {
  localStorage.setItem(STORAGE_KEY, mode)
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
