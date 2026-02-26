"use client"

import { PositionedGridItem } from "@/lib/util/calculate-block-position"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import clsx from "clsx"
import React, { useState, useEffect } from "react"
import SkeletonText from "@/modules/skeletons/components/skeleton-text"
import { default as NextImage } from "next/image"

export const InnerGridItem = ({
  title,
  subtitle,
  image,
}: {
  title?: string
  subtitle?: string
  image?: { url: string; width: number; height: number }
}) => {
  const imageUrl = image?.url
  const isVideo = imageUrl?.toLowerCase().endsWith(".mp4")

  const textColorClass = "text-black"
  const aspectRatio =
    image?.width && image?.height ? image.width / image.height : 16 / 9
  const adjustedHeight = 1600 / aspectRatio

  return (
    imageUrl && (
      <div className="relative w-full h-full">
        <div className={`${textColorClass}`}>
          <div className="flatlist-grid-title absolute top-4 left-4 right-4">
            {title && <div className="flex flex-row gap-1">{title}</div>}
          </div>
          <div className="flatlist-grid-subtitle absolute bottom-4 left-4 right-4">
            {subtitle && (
              <div className="flex flex-row gap-1">
                <span>{"> "}</span>
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="h-full w-full">
          {isVideo ? (
            <video
              autoPlay
              playsInline
              muted
              loop
              className="h-full w-full object-cover object-center transition-all duration-300"
              src={imageUrl}
            />
          ) : (
            <NextImage
              width={1600}
              height={adjustedHeight}
              className="h-full w-full object-cover object-center transition-all duration-300"
              src={`${imageUrl}?w=1600`}
              alt={title ?? "FLATLIST"}
            />
          )}
        </div>
      </div>
    )
  )
}

export const GridItem = ({ block }: { block: PositionedGridItem }) => {
  const classes = clsx(
    `lg:col-start-${block.colStart}`,
    `lg:col-end-${block.colEnd}`,
    `lg:col-span-${block.width}`,
    `lg:row-start-${block.rowStart}`,
    `lg:row-end-${block.rowEnd}`,
    `lg:row-span-${block.height}`
  )

  if (block.target && block.target.destination) {
    return (
      <LocalizedClientLink
        className={classes}
        href={`/${block.target.destination}`}
      >
        <InnerGridItem
          title={block.title}
          subtitle={block.subtitle}
          image={block.image}
        />
      </LocalizedClientLink>
    )
  }

  return (
    <div className={classes}>
      <InnerGridItem
        title={block.title}
        subtitle={block.subtitle}
        image={block.image}
      />
    </div>
  )
}
