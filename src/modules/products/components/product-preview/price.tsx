import { clx } from "@medusajs/ui"

export type PriceType = {
  price_type?: string
  original_price?: string
  calculated_price: string
  purchasable?: boolean
}

const formatPrice = (price: string) => {
  return price.endsWith(".00") ? price.slice(0, -3) : price
}

export default async function PreviewPrice({
  price,
  purchasable,
}: {
  price: PriceType
  purchasable?: boolean
}) {
  return (
    <>
      {price.price_type === "sale" && (
        <div
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price && formatPrice(price.original_price)}
        </div>
      )}
      <div className="flex flex-row gap-1">
        <span>{"> "}</span>
        {purchasable ? (
          <div
            className={clx("text-black", {
              "flatlist-mini-text": price.price_type === "sale",
            })}
            data-testid="price"
          >
            {formatPrice(price.calculated_price)}
          </div>
        ) : (
          <span>
            {formatPrice(price.calculated_price)}{" "}
            <span className="flatlist-mini-text">(Out of stock)</span>
          </span>
        )}
      </div>
    </>
  )
}
