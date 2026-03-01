import "server-only"
import { cookies as nextCookies } from "next/headers"

const isProd = process.env.NODE_ENV === "production"

const cookieBase = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  sameSite: "lax" as const, // ✅ strict না
  secure: isProd,           // ✅ production only secure
  path: "/",                // ✅ always set path
}

export const getAuthHeaders = async (): Promise<{ authorization: string } | {}> => {
  const cookieStore = await nextCookies()
  const token = cookieStore.get("_medusa_jwt")?.value
  if (!token) return {}
  return { authorization: `Bearer ${token}` }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookieStore = await nextCookies()
    const cacheId = cookieStore.get("_medusa_cache_id")?.value
    if (!cacheId) return ""
    return `${tag}-${cacheId}`
  } catch {
    return ""
  }
}

export const getCacheOptions = async (tag: string): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") return {}

  const cacheTag = await getCacheTag(tag)
  if (!cacheTag) return {}

  return { tags: [cacheTag] }
}

export const setAuthToken = async (token: string) => {
  const cookieStore = await nextCookies()
  cookieStore.set("_medusa_jwt", token, cookieBase)
}

export const removeAuthToken = async () => {
  const cookieStore = await nextCookies()
  cookieStore.set("_medusa_jwt", "", { ...cookieBase, maxAge: -1 })
}

export const getCartId = async () => {
  const cookieStore = await nextCookies()
  return cookieStore.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookieStore = await nextCookies()
  cookieStore.set("_medusa_cart_id", cartId, cookieBase)
}

export const removeCartId = async () => {
  const cookieStore = await nextCookies()
  cookieStore.set("_medusa_cart_id", "", { ...cookieBase, maxAge: -1 })
}