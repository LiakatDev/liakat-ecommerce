import { HttpTypes } from "@medusajs/types"

export function getProductTitle(
  product:
    | HttpTypes.StoreProduct
    | Omit<HttpTypes.StoreCartLineItem, "beforeInsert">
): {
  title: string
  variant: string
} {
  let title: string = product.title ?? ""
  let variant: string = ""

  const { metadata } = product

  if (!metadata) {
    return { title, variant }
  }

  const {
    Style,
    "Frame Color": frameColor,
    "Lens Color": lensColor,
  }: {
    Style?: string
    "Frame Color"?: string
    "Lens Color"?: string
  } = metadata

  if (Style) {
    title = Style
  }

  if (frameColor && lensColor) {
    variant = `${frameColor} / ${lensColor} Lens`
  }

  return { title, variant }
}
