import { getJournal } from "@/lib/contentful"
import { renderContent } from "@/lib/util/render-content"
import JournalHero from "@/modules/contenful/templates/journal-hero"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { buildMetadata } from "@/lib/build-metadata"

export async function generateMetadata({
  params,
}: {
  params: { countryCode: string; slug: string }
}): Promise<Metadata> {
  const post = await getJournal(params.slug)

  if (!post) {
    notFound()
  }

  const metadata = await buildMetadata(
    params.countryCode,
    "/",
    post.title,
    post.excerpt
  )
  return metadata
}

export default async function JournalPost({
  params,
}: {
  params: { slug: string }
}) {
  const { isEnabled } = await draftMode()
  const post = await getJournal(params.slug, isEnabled)

  if (!post) {
    notFound()
  }

  const content = post.contentCollection?.items

  return (
    <div>
      <JournalHero
        title={post.title}
        excerpt={post.excerpt}
        image={post.featuredImage}
      />
      <div className="content-container max-w-prose mx-auto space-y-4 my-8 md:my-16">
        {content?.map((c: any, i: number) => {
          const key = c.sys?.id || i
          return <div key={key}>{renderContent(c)}</div>
        })}
      </div>
    </div>
  )
}
