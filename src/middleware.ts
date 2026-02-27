import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

const PUBLISHABLE_API_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk"
).toLowerCase()

const regionCache = {
  map: new Map<string, HttpTypes.StoreRegion>(),
  updated: 0,
}

async function getRegions() {
  // 1 hour cache
  if (regionCache.map.size && regionCache.updated > Date.now() - 60 * 60 * 1000) {
    return regionCache.map
  }

  // fail open if env missing (prevents 500 on Vercel)
  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    return regionCache.map
  }

  try {
    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return regionCache.map

    const data = await res.json().catch(() => null)
    const regions = data?.regions || []

    const nextMap = new Map<string, HttpTypes.StoreRegion>()
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        const code = c.iso_2?.toLowerCase()
        if (code) nextMap.set(code, region)
      })
    })

    regionCache.map = nextMap
    regionCache.updated = Date.now()
  } catch {
    // fail open
  }

  return regionCache.map
}

function getCountryFromUrl(pathname: string) {
  return pathname.split("/")[1]?.toLowerCase()
}

function ensureCacheCookie(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get("_medusa_cache_id")) {
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { nextUrl } = request
    const { pathname } = nextUrl

    // Skip static files fast
    if (pathname.includes(".")) return NextResponse.next()

    // Skip auth routes
    if (
      pathname === "/login" ||
      pathname === "/reset-password" ||
      pathname === "/set-password"
    ) {
      return NextResponse.next()
    }

    const regions = await getRegions()

    // If regions can't be fetched, don't break the site
    if (!regions.size) return NextResponse.next()

    const urlCountry = getCountryFromUrl(pathname)
    const validCountry = typeof urlCountry === "string" && regions.has(urlCountry)

    // Pick a country safely (always string)
    let country: string = DEFAULT_REGION
    const firstKey = regions.keys().next().value as string | undefined

    if (validCountry) {
      country = urlCountry as string
    } else if (regions.has(DEFAULT_REGION)) {
      country = DEFAULT_REGION
    } else if (firstKey) {
      country = firstKey
    }

    // "/" → "/{country}"
    if (pathname === "/") {
      const url = nextUrl.clone()
      url.pathname = `/${country}`
      return NextResponse.redirect(url, 307)
    }

    // If missing/invalid country, prefix it (avoid /dk/dk/...)
    if (!validCountry) {
      const url = nextUrl.clone()

      const alreadyPrefixed =
        pathname === `/${country}` || pathname.startsWith(`/${country}/`)

      if (!alreadyPrefixed) {
        url.pathname = `/${country}${pathname}`
      }

      const res = NextResponse.redirect(url, 307)
      ensureCacheCookie(request, res)
      return res
    }

    // cart_id present but no step → force step=address
    const cartId = nextUrl.searchParams.get("cart_id")
    const step = nextUrl.searchParams.get("step")

    if (cartId && !step) {
      const url = nextUrl.clone()
      url.searchParams.set("step", "address")

      const res = NextResponse.redirect(url, 307)
      res.cookies.set("_medusa_cart_id", cartId, {
        path: "/",
        maxAge: 60 * 60 * 24,
      })
      ensureCacheCookie(request, res)
      return res
    }

    // normal request
    const response = NextResponse.next()
    ensureCacheCookie(request, response)
    return response
  } catch {
    // NEVER crash middleware on Vercel
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
}