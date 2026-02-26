import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { getAllJournalPosts, getAllPages } from "@/lib/contentful"

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers)
  const secret = requestHeaders.get("x-vercel-reval-key")

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  revalidateTag("pages")
  revalidateTag("journalPosts")
  revalidateTag("siteConfig")

  const pages = await getAllPages()
  const posts = await getAllJournalPosts()

  await Promise.all(
    pages.map((p) => {
      revalidateTag(`page_${p.slug}`)
      revalidatePath(`/${p.slug}`)
    })
  )

  await Promise.all(
    posts.map((p) => {
      revalidateTag(`journal_${p.slug}`)
      revalidatePath(`/journal/${p.slug}`)
    })
  )

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
