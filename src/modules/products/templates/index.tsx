import React, { Suspense } from "react"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { Heading } from "@medusajs/ui"
import { getProductTitle } from "@/lib/util/get-product-title"
import { ProductDescription } from "../components/product-description"
import ImageDisplay from "@/modules/products/components/image-display"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  console.log("product", product)

  const { title, variant } = getProductTitle(product)

  const { thumbnail, images } = product

  const sortedImages: string[] = [
    thumbnail as string,
    ...(images
      ? images
          .filter((image: { url: string }) => image.url !== thumbnail)
          .map((image: { url: string }) => image.url)
      : []),
  ]

  console.log("product", product)

  return (
    <>
      <div
        className="grid small:grid-cols-2 h-[100%] gap-3 p-2"
        data-testid="product-container"
      >
        <div className="w-full">
          <div className="overflow-y-scroll no-scrollbar">
            <ImageDisplay
              images={sortedImages}
              thumbnail={product.thumbnail || ""}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col sticky top-[167px]">
            <Heading
              level="h2"
              className="flatlist-product-title-bold max-w-[350px]"
              data-testid="product-title"
            >
              {title}
            </Heading>
            <Heading
              level="h2"
              className="flatlist-product-title-medium max-w-[350px]"
              data-testid="product-title"
            >
              {variant}
            </Heading>
            <div className="flex flex-row w-full">
              <div className="hidden small:block w-full mt-24">
                <ProductDescription regionId={region.id} product={product} />
              </div>
              <div className="w-full -mt-[40px]">
                <Suspense>
                  <ProductActionsWrapper id={product.id} region={region} />
                </Suspense>
              </div>
            </div>
            <div className="small:hidden block w-full mt-4">
              <ProductDescription regionId={region.id} product={product} />
            </div>
          </div>
        </div>

        <div className="small:hidden w-full">
          <div className="overflow-y-scroll no-scrollbar">
            <ImageGallery images={sortedImages.slice(1)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
