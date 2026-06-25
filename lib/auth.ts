export const ADMIN_USER = "admin"
export const ADMIN_EMAIL = "admin@admin.com"
export const ADMIN_PASSWORD = "12345678"

export function normalizeAuthEmail(value: string) {
  const trimmed = value.trim().toLowerCase()
  return trimmed === ADMIN_USER ? ADMIN_EMAIL : trimmed
}

export function isAdminEmail(email: string | null | undefined) {
  return email?.toLowerCase() === ADMIN_EMAIL
}
