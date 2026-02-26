import { Heading, Text } from "@medusajs/ui"

import Divider from "@/modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@/lib/util/money"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h2" className="flex flex-row flatlist-mini-title my-6">
        Delivery
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="flatlist-text mb-1">Shipping Address</Text>
          <Text className="flatlist-text">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="flatlist-text">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="flatlist-text">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="flatlist-text">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="flatlist-text mb-1">Contact</Text>
          <Text className="flatlist-text">{order.shipping_address?.phone}</Text>
          <Text className="flatlist-text">{order.email}</Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="flatlist-text mb-1">Method</Text>
          <Text className="flatlist-text">
            {order.shipping_methods?.[0]?.shipping_option_id} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.amount ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
