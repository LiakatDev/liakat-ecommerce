import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "./get-product-price"

const stripCurrency = (price: string) => {
  return parseFloat(price.replace(/[^0-9.]/g, ""))
}

const sortProducts = (
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
) => {
  if (sortBy === "price_asc") {
    return products.sort((a, b) => {
      const aPrice = getProductPrice({ product: a })
      const bPrice = getProductPrice({ product: b })

      if (
        !aPrice.cheapestPrice?.calculated_price ||
        !bPrice.cheapestPrice?.calculated_price
      )
        return 0

      return (
        stripCurrency(aPrice.cheapestPrice?.calculated_price) -
        stripCurrency(bPrice.cheapestPrice?.calculated_price)
      )
    })
  }

  if (sortBy === "price_desc") {
    return products.sort((a, b) => {
      const aPrice = getProductPrice({ product: a })
      const bPrice = getProductPrice({ product: b })

      if (
        !aPrice.cheapestPrice?.calculated_price ||
        !bPrice.cheapestPrice?.calculated_price
      )
        return 0

      return (
        stripCurrency(bPrice.cheapestPrice?.calculated_price) -
        stripCurrency(aPrice.cheapestPrice?.calculated_price)
      )
    })
  }

  if (sortBy === "created_at") {
    return products.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0

      return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
    })
  }

  return products
}

export default sortProducts
