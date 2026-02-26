"use server"

import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { cache } from "react"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = (await retrieveRegion(regionId!)) as HttpTypes.StoreRegion
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  const products = await sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)

  console.log("products", products)

  return products
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

export const searchProductsByTitle = cache(async function ({
  searchTerm,
  regionId,
}: {
  searchTerm: string
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        q: searchTerm,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})
