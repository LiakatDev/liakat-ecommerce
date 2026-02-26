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
  if (
    regionCache.map.size &&
    regionCache.updated > Date.now() - 60 * 60 * 1000
  ) {
    return regionCache.map
  }

  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    return regionCache.map
  }

  try {
    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return regionCache.map

    const data = await res.json()
    const regions = data?.regions || []

    regionCache.map = new Map()

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        const code = c.iso_2?.toLowerCase()
        if (code) regionCache.map.set(code, region)
      })
    })

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

    // Skip static files
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
    if (!regions.size) return NextResponse.next()

    const urlCountry = getCountryFromUrl(pathname)

    const validCountry =
      typeof urlCountry === "string" && regions.has(urlCountry)

    // ✅ country always string (no TS error)
    let country: string = DEFAULT_REGION

    const firstKey = regions.keys().next().value as string | undefined

    if (validCountry) {
      country = urlCountry as string
    } else if (regions.has(DEFAULT_REGION)) {
      country = DEFAULT_REGION
    } else if (firstKey) {
      country = firstKey
    }

    // ROOT "/" → redirect
    if (pathname === "/") {
      const url = nextUrl.clone()
      url.pathname = `/${country}`
      return NextResponse.redirect(url, 307)
    }

    // Missing/invalid country in URL → prefix it
    if (!validCountry) {
      const url = nextUrl.clone()
      url.pathname = `/${country}${pathname}`
      return NextResponse.redirect(url, 307)
    }

    // Handle cart step redirect
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

    const response = NextResponse.next()
    ensureCacheCookie(request, response)
    return response
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)"],
}