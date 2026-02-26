import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import ProductTemplate from "@/modules/products/templates"
import SkeletonProductPage from "@/modules/skeletons/templates/skeleton-product-page"
import { buildMetadata } from "@/lib/build-metadata"
import { getRegion } from "@/lib/data/regions"
import { getProductByHandle } from "@/lib/data/products"
import { getProductPrice } from "@/lib/util/get-product-price"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryCode, handle } = await params

  const region = await getRegion(countryCode)
  if (!region) notFound()

  const product = await getProductByHandle(handle, region.id)
  if (!product) notFound()

  return buildMetadata(
    countryCode,
    `/products/${handle}`,
    `${product.title} | FLATLIST Eyewear`,
    `${product.description}`,
    {
      openGraph: {
        title: `${product.title} | FLATLIST Eyewear`,
        description: `${product.title}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  )
}

export default async function ProductPage({ params }: Props) {
  const { countryCode, handle } = await params

  const region = await getRegion(countryCode)
  if (!region) notFound()

  const product = await getProductByHandle(handle, region.id)
  if (!product) notFound()

  const price = getProductPrice({ product })
  const purchasable = product.variants?.some(
    (v) => (v.inventory_quantity ?? 0) > 0
  )

  const productJson = {
    "@context": "http://schema.org",
    "@type": "Product",
    name: product.title,
    price: price.cheapestPrice,
    sku: product.variants?.[0]?.sku,
    offers: {
      "@type": "Offer",
      url: `https://flatlisteyewear.com/products/${handle}`,
      availability: purchasable
        ? `http://schema.org/InStock`
        : `http://schema.org/SoldOut`,
      price: price.cheapestPrice,
      priceCurrency: region.currency_code,
    },
    brand: { "@type": "Brand", name: "FLATLIST Eyewear" },
  }

  return (
    <Suspense fallback={<SkeletonProductPage />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJson) }}
      />
      <ProductTemplate product={product} region={region} />
    </Suspense>
  )
}
