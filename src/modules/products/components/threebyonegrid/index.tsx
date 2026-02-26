import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Thumbnail from "@/modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"
export default async function ThreeByOneGrid({
  productPreview,
  isFeatured,
}: {
  productPreview: HttpTypes.StoreProduct
  isFeatured?: boolean
}) {
  return (
    <LocalizedClientLink
      href={`/products/${productPreview.handle}`}
      className="group relative"
    >
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={productPreview.thumbnail}
          size="full"
          isFeatured={isFeatured}
        />

        <div className="absolute top-4 left-4 right-4 flex txt-compact-medium justify-between">
          <Text
            className="text-xl leading-tight tracking-wide text-black font-light transition-all duration-500"
            data-testid="product-title"
          >
            {productPreview.title}
          </Text>
        </div>

        <div className="absolute bottom-3 left-4 flex txt-compact-medium justify-between">
          <Text
            className="flatlist-mini-text text-[12px] uppercase"
            data-testid="product-title"
          >
            {"> "}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
