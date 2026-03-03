import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@/modules/common/icons/placeholder-image"
import { HttpTypes } from "@medusajs/types"

/**
 * Normalize image url:
 * - If it's already relative (/products/...), keep it.
 * - If it's your Vercel domain absolute URL, convert to relative path.
 * - If it's a Medusa static URL (/static/filename), map to /products/filename (from /public/products).
 * - Otherwise keep as-is.
 */
function normalizeImageUrl(url?: string | null) {
  if (!url) return undefined

  const u = String(url).trim()
  if (!u) return undefined

  // Already relative => best for next/image (served from /public)
  if (u.startsWith("/")) {
    // If it's /static/xxx, map to /products/xxx
    if (u.startsWith("/static/")) {
      const filename = u.split("/").pop()
      return filename ? `/products/${filename}` : u
    }
    return u
  }

  // Parse absolute url
  try {
    const parsed = new URL(u)
    const host = parsed.hostname.toLowerCase()
    const pathname = parsed.pathname || "/"

    // If URL is your storefront domain and points to /products, convert to relative
    if (host === "liakat-ecommerce.vercel.app" && pathname.startsWith("/products/")) {
      return pathname
    }

    // If it points to medusa static files, map to /products/<filename>
    // Examples:
    // - http://localhost:9000/static/Screenshot%202026-01-18%20113359.png
    // - https://genuine-victory-production.up.railway.app/static/xxx.png
    if (pathname.startsWith("/static/")) {
      const filename = pathname.split("/").pop()
      return filename ? `/products/${filename}` : pathname
    }

    return u
  } catch {
    return u
  }
}

type ThumbnailProps = {
  thumbnail?: string | null
  images?: HttpTypes.StoreProductImage[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = normalizeImageUrl(thumbnail || images?.[0]?.url)

  return (
    <Container
      className={clx(
        "relative w-full object-contain rounded-none shadow-none overflow-hidden p-4 ease-in-out duration-150",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[11/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="object-cover object-top"
      draggable={false}
      quality={70}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
