import { clx } from "@medusajs/ui"

import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

const formatPrice = (price: string) => {
  return price.endsWith(".00") ? price.slice(0, -3) : price
}

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col uppercase mt-16 small:mt-0">
      {selectedPrice.price_type === "sale" && (
        <div
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {formatPrice(selectedPrice.original_price)}
        </div>
      )}
      <div className="flex flex-row gap-1 text-4xl">
        <span>{"> "}</span>
        <div
          className={clx("text-black text-4xl font-medium", {})}
          data-testid="price"
        >
          {formatPrice(selectedPrice.calculated_price)}
        </div>
      </div>
    </div>
  )
}
