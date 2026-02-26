import { buildMetadata } from "@/lib/build-metadata"
import { getPage } from "@/lib/contentful"
import { renderContent } from "@/lib/util/render-content"
import PageHero from "@/modules/contenful/templates/page-hero"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string; slug: string }>
}): Promise<Metadata> {
  const { countryCode, slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  const metadata = await buildMetadata(
    countryCode,
    `/${slug}`,
    page.title,
    page.excerpt
  )
  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { isEnabled } = await draftMode()
  const { slug } = await params
  const page = await getPage(slug, isEnabled)

  if (!page) {
    notFound()
  }

  const content = page.contentCollection?.items

  return (
    <div>
      <PageHero
        title={page.title}
        excerpt={page.excerpt}
        image={page.featuredImage}
      />
      <div className="py-2 content-container space-y-2 mx-auto">
        {content?.map((c: any, i: number) => {
          const key = c.sys?.id || i
          return <div key={key}>{renderContent(c)}</div>
        })}
      </div>
    </div>
  )
}
