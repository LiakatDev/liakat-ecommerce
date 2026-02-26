import { HttpTypes, StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type SiteConfig = {
  sys: { id: string }
  brandName: string
  logo: {
    url: string
    width: number
    height: number
  }
  headerNavigation: { navigationItemsCollection: { items: NavigationItem[] } }
  footerSectionsCollection: {
    items: Navigation[]
  }
  copyrightText: string
  facebookLink: string
  instagramLink: string
  youTubeLink: string
}

export type NavigationItem = {
  sys: {
    id: string
  }
  title: string
  link: string
  subItemsCollection?: {
    items: { sys: { id: string }; title: string; link: string }[]
  }
}

export type Navigation = {
  internalName?: string
  navigationItemsCollection: { items: NavigationItem[] }
}

export type InfiniteProductPage = {
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
}
