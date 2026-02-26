"use client"

import ImageGallery from "@/modules/products/components/image-gallery"
import React, { useEffect, useState } from "react"

type ImageDisplayProps = {
  images: string[]
  thumbnail: string
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, thumbnail }) => {
  const isClient = typeof window === "object"
  const [windowWidth, setWindowWidth] = useState(
    isClient ? window.innerWidth : undefined
  )

  useEffect(() => {
    if (!isClient) {
      // If we're not in a browser environment, don't do anything
      return
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isClient]) // Only run this effect if we're in a browser environment

  const isMobile = windowWidth ? windowWidth <= 900 : false // Adjust this value as needed
  const imagesToShow = isMobile ? 1 : images.length

  return <ImageGallery images={images.slice(0, imagesToShow)} />
}

export default ImageDisplay
