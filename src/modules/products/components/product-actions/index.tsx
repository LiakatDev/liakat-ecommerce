"use client"

import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import Divider from "@/modules/common/components/divider"
import OptionSelect from "@/modules/products/components/option-select"
import ProductPrice from "../product-price"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@/lib/data/cart"
import { viewItem, addToCart as addToCartGtm } from "@/lib/gtm"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string
  const hasTrackedView = useRef(false)

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock (kept for future UI use)
  // Note: inventory_quantity from Store API can be unreliable in some setups.
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      addToCartGtm(product, 1, region.currency_code)
    } catch (error) {
      console.error("Error adding to cart:", error)
      // Optional: show UI error message/toast here
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (product && region && !hasTrackedView.current) {
      viewItem(product, region.currency_code)
      hasTrackedView.current = true
    }
  }, [product, region.currency_code])

  return (
    <>
      <div className="flex flex-col items-end" ref={actionsRef}>
        <div>
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <div className="flex flex-col gap-3 lg:gap-3 w-full small:max-w-[300px] items-end mt-6 md:mt-24 mb-6 small:mb-0">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !!disabled || isAdding || !isValidVariant}
            className="flatlist-dark-button w-full h-10"
            data-testid="add-product-button"
          >
            {!selectedVariant
              ? "Select variant"
              : !isValidVariant
                ? "Select variant"
                : isAdding
                  ? "Adding to cart..."
                  : "Add to cart"}
          </button>
        </div>
      </div>
    </>
  )
}