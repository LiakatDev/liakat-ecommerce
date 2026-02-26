import Image from "next/image"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { getProductTitle } from "@/lib/util/get-product-title"
import { includes } from "lodash"
import PreviewPrice from "./price"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default async function ProductPreview({
  productPreview,
}: {
  productPreview: HttpTypes.StoreProduct
  isFeatured?: boolean
}) {
  const prices = getProductPrice({
    product: productPreview,
  })

  const { title, variant } = getProductTitle(productPreview)
  const thumbnail = productPreview.thumbnail ?? "https://placehold.co/1200x800"

  const { cheapestPrice } = getProductPrice({
    product: productPreview,
  })

  const imageUrl = `${thumbnail}${
    includes(thumbnail, "?w=1200") ? `&q=100` : ""
  }`

  const inventoryQuantity = productPreview.variants?.reduce((acc, variant) => {
    return acc + (variant?.inventory_quantity || 0)
  }, 0)

  const isPurchasable = inventoryQuantity && inventoryQuantity > 0

  return (
    <LocalizedClientLink
      href={`/products/${productPreview.handle}`}
      className="group relative"
    >
      <div data-testid="product-wrapper">
        <div className={`relative w-full h-full `}>
          <div className="flatlist-grid-title absolute top-4 left-4 right-4">
            {title && (
              <div className="flex flex-row gap-1 font-medium flatlist-text">
                {title}
              </div>
            )}
            {variant && (
              <div className="flex flex-row gap-1 flatlist-text">{variant}</div>
            )}
          </div>
          <div className="flatlist-grid-subtitle absolute bottom-4 left-4 right-4 flatlist-mini-text">
            {cheapestPrice && (
              <PreviewPrice
                price={cheapestPrice}
                purchasable={isPurchasable ? true : false}
              />
            )}
          </div>
          {includes(imageUrl, "placehold.co") ? (
            <img src={imageUrl} className="h-full w-full object-cover" />
          ) : (
            <Image
              width={1200}
              height={800}
              className="h-80 object-cover object-center"
              priority={true}
              style={{ objectFit: "cover" }}
              src={imageUrl}
              alt={title ?? "FLATLIST"}
            />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
