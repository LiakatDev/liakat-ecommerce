import { getProductsById, listProducts } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@/modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  console.log("id", id)
  console.log("region", region)

  const products = await getProductsById({
    ids: [id],
    regionId: region.id,
  })

  console.log("products", products)

  if (!products.length) {
    return null
  }

  const product = products[0]

  return <ProductActions product={product} region={region} />
}
