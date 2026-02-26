import { Text, clx } from "@medusajs/ui"

export default async function PreviewPrice({
  price,
}: {
  price: {
    calculated_price: string
    original_price: string
    price_type: string
  }
}) {
  return (
    <>
      {price.price_type === "sale" && (
        <>
          <Text
            className="line-through text-ui-fg-muted"
            data-testid="original-price"
          >
            {price.original_price}
          </Text>
        </>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "flatlist-mini-text": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
