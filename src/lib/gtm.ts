import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "./util/get-product-price"

// Define the shape of the event data you want to push
interface DataLayerEvent {
  event: string
  eventCategory?: string
  eventAction?: string
  eventLabel?: string
  eventValue?: number
  ecommerce?: {
    currency: string
    value: number
    items: EcommerceItem[]
    transaction_id?: string
    tax?: number
    shipping?: number
    coupon?: string
  } | null
}

// Function to push events to the `dataLayer`
export const pushToDataLayer = (eventData: DataLayerEvent): void => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    ;(window as any).dataLayer.push(eventData)
  } else {
    console.warn("dataLayer is not available.")
  }
}

interface EcommerceItem {
  item_id: string
  item_name: string
  affiliation?: string
  coupon?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price: number
  quantity?: number
  promotion_id?: string
  promotion_name?: string
}

// Helper function to convert Medusa product to GA4 format
const convertProductToItem = (
  product: HttpTypes.StoreProduct,
  index?: number
): EcommerceItem => {
  // Safely get the price in the correct format
  const price = getProductPrice({ product: product as HttpTypes.StoreProduct })
  const variant = product.variants?.length ? product.variants[0] : null

  const sku = variant?.sku ?? product.id

  return {
    item_id: sku,
    item_name: product.title,
    item_variant: variant?.title ?? "N/A",
    price: price.cheapestPrice?.calculated_price_number,
    index,
  }
}

// Helper function to calculate total value
const calculateValue = (items: EcommerceItem[]): number => {
  return items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  )
}

// View Item Event
export const viewItem = (
  product: HttpTypes.StoreProduct,
  currency: string
): void => {
  const item = convertProductToItem(product)

  pushToDataLayer({ event: "clear", ecommerce: null }) // Clear previous object
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateValue([item]),
      items: [item],
    },
  })
}

// Add to Cart Event
export const addToCart = (
  product: HttpTypes.StoreProduct,
  quantity: number,
  currency: string
): void => {
  const item = convertProductToItem(product, quantity)

  pushToDataLayer({ event: "clear", ecommerce: null })
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateValue([item]),
      items: [{ ...item, quantity }],
    },
  })
}

// Begin Checkout Event
export const beginCheckout = (cart: HttpTypes.StoreCart): void => {
  const items = cart.items?.map((item) => {
    const itemData = convertProductToItem(item.product!)
    return {
      ...itemData,
      quantity: item.quantity,
      discount: item.discount_total,
    }
  })

  pushToDataLayer({ event: "clear", ecommerce: null })
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: cart.currency_code.toUpperCase() ?? "USD",
      value: calculateValue(items ?? []),
      items: items ?? [],
    },
  })
}

// Purchase Event
export const purchase = (
  order: HttpTypes.StoreCart & { promotions?: HttpTypes.StorePromotion[] },
  orderId: string
): void => {
  const items = order.items?.map((item) => {
    const itemData = convertProductToItem(item.product!)
    return {
      ...itemData,
      quantity: item.quantity,
      discount: item.discount_total,
    }
  })

  const coupon = order.promotions?.find((promotion) => promotion.code)

  pushToDataLayer({ event: "clear", ecommerce: null })
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: orderId,
      currency: order.currency_code.toUpperCase() ?? "USD",
      value: calculateValue(items ?? []),
      tax: order.tax_total || 0,
      shipping: order.shipping_total || 0,
      items: items ?? [],
      coupon: coupon?.code,
    },
  })
}
