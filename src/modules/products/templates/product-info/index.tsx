import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-8 sm:gap-y-14 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:flatlist-mini-text"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        <Heading
          level="h2"
          className="font-america font-normal text-3xl leading-10 uppercase"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <div
          className="font-america text-[12px] font-normal leading-snug break-all"
          data-testid="product-description"
        >
          {product.description}
          This is some filler description. Delete later. According to Hanky,
          life is short and sometimes slow. Apparently, the best cure for that
          is a car. However, the question isn’t which car you’d like to drive,
          it’s which car you’d like to be caught dead in. Also, don’t drive
          without a license (in the city).
          <br />
          <br />
          100% handmade Italian Mazzucchelli acetate.
          <br />
          <br />
          Carl Zeiss CR-39 scratch-free lenses, providing 100% UVA/UVB
          protection.
          <br />
          <br />
          Stainless steel, nickel-free OBE hinges w/ silicone safety screws.
          <br />
          <br />
          Lens 48.5 mm
          <br />
          Bridge 20.5 mm
          <br />
          Width 137.5 mm
          <br />
          Temple length 140 mm
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
