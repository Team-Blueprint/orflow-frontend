import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const STORAGE_KEY = "orflow_env"

export type EnvMode = "test" | "live"

export function getStoredEnv(): EnvMode {
  if (typeof window === "undefined") return "live"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "test" || stored === "live") return stored
  return "live"
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

  const setMode = (newMode: EnvMode) => {
    setStoredEnv(newMode)
    setModeState(newMode)
  }

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        const val = e.newValue
        if (val === "test" || val === "live") setModeState(val)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <EnvContext.Provider value={{ mode, isTest: mode === "test", setMode }}>
      {children}
    </EnvContext.Provider>
  )
}

export function useEnv(): EnvContextValue {
  const ctx = useContext(EnvContext)
  if (!ctx) throw new Error("useEnv must be used within an EnvProvider")
  return ctx
}
