const LS_PORTAL_TOKEN = "portal_session_token"
const LS_PORTAL_SLUG = "portal_token_slug"

export function getPortalToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LS_PORTAL_TOKEN)
}

export function setPortalToken(token: string): void {
  localStorage.setItem(LS_PORTAL_TOKEN, token)
}

export function clearPortalToken(): void {
  localStorage.removeItem(LS_PORTAL_TOKEN)
}

export function getPortalSlug(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LS_PORTAL_SLUG)
}

export function setPortalSlug(slug: string): void {
  localStorage.setItem(LS_PORTAL_SLUG, slug)
}

export function clearPortalSlug(): void {
  localStorage.removeItem(LS_PORTAL_SLUG)
}

export function clearPortalSession(): void {
  clearPortalToken()
  clearPortalSlug()
}
