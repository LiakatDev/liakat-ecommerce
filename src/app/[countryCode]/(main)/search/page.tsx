import { searchProductsByTitle } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import ProductPreview from "@/modules/products/components/product-preview"
import { Suspense } from "react"

async function SearchResults({
  query,
  countryCode,
}: {
  query: string
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  if (!region) return null

  const products = await searchProductsByTitle({
    searchTerm: query,
    regionId: region.id,
  })

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">No results found</h2>
        <p className="text-gray-500">Try searching for something else</p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2">
      {products.map((p) => (
        <li key={p.id}>
          <ProductPreview productPreview={p} />
        </li>
      ))}
    </ul>
  )
}

export default async function SearchPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ q?: string }>
  params: Promise<{ countryCode: string }>
}) {
  const [{ q }, { countryCode }] = await Promise.all([searchParams, params])

  if (!q) {
    return (
      <div className="content-container py-12">
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-gray-500">Please enter a search term</p>
      </div>
    )
  }

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl font-bold mb-8">Search results for "{q}"</h1>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={q} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="aspect-[9/16] bg-gray-100 animate-pulse rounded-md"
        />
      ))}
    </div>
  )
}
