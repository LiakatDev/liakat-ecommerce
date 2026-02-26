import { getAllJournalPosts, getAllPages } from "@/lib/contentful"
import { listProducts } from "@/lib/data/products"
import { MetadataRoute } from "next"

const getBaseUrl = (path: string) => {
  return `https://flatlisteyewear.com${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages()
  const pageEntries = pages.map((page) => ({
    url: getBaseUrl(`/${page.slug}`),
    lastModified: page.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 1,
  }))

  const posts = await getAllJournalPosts()
  const postEntries = posts.map((post) => ({
    url: getBaseUrl(`/journal/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const products = await listProducts({ countryCode: "dk" })
  const productEntries = products.response.products.map((product) => ({
    url: getBaseUrl(`/products/${product.handle}`),
    lastModified: product.created_at,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://flatlisteyewear.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...pageEntries,
    ...postEntries,
    ...productEntries,
  ]
}
