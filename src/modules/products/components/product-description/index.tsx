"use server"

import * as React from "react"
import { Text } from "@medusajs/ui"
import { Suspense } from "react"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { listProducts, searchProductsByTitle } from "@/lib/data/products"
import Image from "next/image"

export async function ProductDescription({
  regionId,
  product,
}: {
  regionId: string
  product: HttpTypes.StoreProduct
}) {
  const { metadata } = product
  const hasMetadata = metadata

  return (
    <div className="flex flex-col space-y-6 flatlist-text">
      <StyledText>{product.description}</StyledText>
      <Suspense>
        {hasMetadata && metadata.Style ? (
          <FamilyProducts
            family={metadata.Style as string}
            productId={product.id!}
            regionId={regionId}
          />
        ) : null}
      </Suspense>
      {hasMetadata && (
        <div>
          <StyledText>{metadata?.Material as string}</StyledText>
          {metadata?.["Lens Supplier"] && metadata?.["UVA/UVB Protection"] ? (
            <StyledText>
              {metadata["Lens Supplier"] as string} lenses with UVA/UVB
              protection
            </StyledText>
          ) : null}
          <StyledText>{metadata?.Hinges as string}</StyledText>
          {metadata?.["Lens Width"] &&
          metadata?.Bridge &&
          metadata?.Width &&
          metadata?.["Temple Length"] ? (
            <StyledText>
              Lens {metadata?.["Lens Width"]?.toString()} mm
              <br />
              Bridge {metadata?.Bridge?.toString()} mm
              <br />
              Width {metadata?.Width?.toString()} mm
              <br />
              Temple length {metadata?.["Temple Length"]?.toString()} mm
            </StyledText>
          ) : null}
        </div>
      )}
    </div>
  )
}

const StyledText = ({ children }: { children: React.ReactNode }) => {
  if (!children || children === "") return

  return (
    <>
      <Text
        className="flatlist-text break-all break-words"
        data-testid="product-description"
      >
        {children}
      </Text>
    </>
  )
}

async function FamilyProducts({
  family,
  productId,
  regionId,
}: {
  family: string
  productId: string
  regionId: string
}) {
  const products = await searchProductsByTitle({
    searchTerm: family,
    regionId,
  })

  console.log(products)

  const styles = products?.filter(
    (product) =>
      (product.metadata?.Style as string).toLowerCase() ===
        family.toLowerCase() && product.id !== productId
  )

  if (!styles || !styles.length) return null

  return (
    <div className="flex flex-col space-y-4">
      <div className="flatlist-micro-title uppercase">
        More colors in {family}
      </div>
      <div className="w-full overflow-x-auto small:overflow-x-visible pb-4 small:pb-0">
        <div className="flex small:grid small:grid-cols-3 gap-2 w-[calc(3.5*6rem+1.5*0.5rem)] small:w-full">
          {styles?.map((style) => (
            <LocalizedClientLink
              key={style.id}
              href={`/products/${style.handle}`}
              className="w-36 h-36 small:w-24 small:h-24 flex-shrink-0"
            >
              <Image
                src={style.thumbnail || ""}
                alt={style.title || ""}
                className="w-full h-full object-cover object-center"
                width={400}
                height={400}
              />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}
