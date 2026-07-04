import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import axios from "axios"
import { apiClient, setAccessToken, LS_API_KEY } from "@/api/apiClient"

interface Tenant {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthState {
  user: Tenant | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Tenant>("/v1/auth/me")
      setUser(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null)
        setAccessToken(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{ tenant: Tenant; access_token: string }>("/v1/auth/signin", { email, password })
    setUser(data.tenant)
    setAccessToken(data.access_token)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post<{ tenant: Tenant; access_token: string }>("/v1/auth/signup", { name, email, password })
    setUser(data.tenant)
    setAccessToken(data.access_token)

    // Auto-generate test API keys for the new user
    try {
      const keyRes = await apiClient.post("/v1/auth/keys/create", { key_type: "sk_test" })
      localStorage.setItem(LS_API_KEY, keyRes.data.value)
    } catch {
      // Key generation failed - user can create manually later
    }
  }, [])

  const logout = useCallback(async () => {
    await apiClient.post("/v1/auth/logout")
    setUser(null)
    setAccessToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
