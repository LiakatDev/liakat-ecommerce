import * as React from "react"
import { getPage } from "@/lib/contentful"
import { notFound } from "next/navigation"
import { renderContent } from "@/lib/util/render-content"
import { draftMode } from "next/headers"
import SkeletonHomeGrid from "@/modules/skeletons/templates/skeleton-home-grid"
import { Metadata } from "next"
import { buildMetadata } from "@/lib/build-metadata"
import { getRegion } from "@/lib/data/regions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const metadata = await buildMetadata(
    countryCode,
    "/",
    "FLATLIST Eyewear",
    "AT FLATLIST WE BELIEVE THAT EXCEPTIONAL QUALITY IS THE CORNERSTONE OF MEMORABLE EXPERIENCES. DRAWING INSPIRATION FROM BOTH LOCAL AND INTERNATIONAL INFLUENCES, FLATLIST HAS BECOME A GO-TO CHOICE FOR CREATIVES WHO SEEK EYEWEAR AS UNIQUE AS THEIR VISION."
  )
  return metadata
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return (
    <React.Suspense fallback={<SkeletonHomeGrid />}>
      <FrontpageContent countryCode={countryCode} />
    </React.Suspense>
  )
}

async function FrontpageContent({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)
  const { isEnabled } = await draftMode()
  const page = await getPage("frontpage", isEnabled)

  if (!page || !region) {
    notFound()
  }

  const content = page.contentCollection?.items

  return (
    <div className="py-2 content-container space-y-2 mx-auto">
      {content?.map((c: any, i: number) => {
        const key = c.sys?.id || i
        return <div key={key}>{renderContent(c)}</div>
      })}
    </div>
  )
}
