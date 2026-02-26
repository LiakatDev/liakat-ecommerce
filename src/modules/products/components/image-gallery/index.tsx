"use client"

import React, { useEffect, useState } from "react"
import { default as NextImage } from "next/image"

type ImageGalleryProps = {
  images: string[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {images.map((image, index) => {
        return (
          <div key={`image-${index}`} className="relative p-0">
            <NextImage
              src={image}
              width={1200}
              height={1600}
              className="object-cover object-center"
              alt={`Product image ${index + 1}`}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ImageGallery
