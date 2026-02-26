import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

/**
 * Prefer server-only envs (works in middleware on Vercel reliably),
 * fallback to NEXT_PUBLIC_* for local dev.
 */
const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

const PUBLISHABLE_API_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const DEFAULT_REGION = (process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk").toLowerCase()

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // If env missing, don't crash middleware (prevents 500 on Vercel)
    if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "middleware.ts: Missing BACKEND_URL or PUBLISHABLE_API_KEY. Set MEDUSA_BACKEND_URL + MEDUSA_PUBLISHABLE_KEY (recommended) or NEXT_PUBLIC_MEDUSA_*."
        )
      }
      return regionMapCache.regionMap
    }

    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
    }).catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.error("middleware.ts: fetch(/store/regions) failed", e)
      }
      return null
    })

    if (!res) return regionMapCache.regionMap

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "middleware.ts: /store/regions returned non-OK",
          json?.message || json
        )
      }
      return regionMapCache.regionMap
    }

    const regions = json?.regions

    if (!regions?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "middleware.ts: No regions found. Please set up regions in your Medusa Admin."
        )
      }
      return regionMapCache.regionMap
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        const code = (c.iso_2 ?? "").toLowerCase()
        if (code) regionMapCache.regionMap.set(code, region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  try {
    let countryCode: string | undefined

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("middleware.ts: Error getting the country code", error)
    }
  }
}

async function setCacheId(request: NextRequest, response: NextResponse) {
  const cacheId = request.nextUrl.searchParams.get("_medusa_cache_id")
  if (cacheId) return cacheId

  const newCacheId = crypto.randomUUID()
  response.cookies.set("_medusa_cache_id", newCacheId, { maxAge: 60 * 60 * 24 })
  return newCacheId
}

/**
 * Middleware to handle region selection and cache id.
 * IMPORTANT: Must never throw (otherwise Vercel shows MIDDLEWARE_INVOCATION_FAILED)
 */
export async function middleware(request: NextRequest) {
  try {
    // ✅ Fix root 404: always redirect "/" to a country code route
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone()
      url.pathname = `/${DEFAULT_REGION}`
      return NextResponse.redirect(url, 307)
    }

    const searchParams = request.nextUrl.searchParams
    const cartId = searchParams.get("cart_id")
    const checkoutStep = searchParams.get("step")
    const cacheIdCookie = request.cookies.get("_medusa_cache_id")
    const cartIdCookie = request.cookies.get("_medusa_cart_id")

    let redirectUrl = request.nextUrl.href
    let response = NextResponse.redirect(redirectUrl, 307)

    // static asset quick pass
    if (request.nextUrl.pathname.includes(".")) return NextResponse.next()

    // auth routes pass
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/reset-password" ||
      request.nextUrl.pathname === "/set-password"
    ) {
      return NextResponse.next()
    }

    // Set a cache id to invalidate the cache for this instance only
    const cacheId = await setCacheId(request, response)

    const regionMap = await getRegionMap(cacheId)

    // If region map empty, fail open (no redirect) — prevents 500
    if (!regionMap || !regionMap.keys().next().value) {
      return NextResponse.next()
    }

    const countryCode = await getCountryCode(request, regionMap)

    const urlHasCountryCode =
      countryCode &&
      request.nextUrl.pathname.split("/")[1]?.toLowerCase() === countryCode

    if (urlHasCountryCode && (!cartId || cartIdCookie) && cacheIdCookie) {
      return NextResponse.next()
    }

    const redirectPath =
      request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

    const queryString = request.nextUrl.search ? request.nextUrl.search : ""

    // If no country code is set, redirect to the relevant region.
    if (!urlHasCountryCode && countryCode) {
      redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
      response = NextResponse.redirect(redirectUrl, 307)
    }

    // If a cart_id is in the params, set cookie and redirect to address step.
    if (cartId && !checkoutStep) {
      redirectUrl = `${redirectUrl}&step=address`
      response = NextResponse.redirect(redirectUrl, 307)
      response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
    }

    return response
  } catch (e) {
    // fail open — never crash middleware
    if (process.env.NODE_ENV === "development") {
      console.error("middleware.ts crashed, failing open:", e)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}