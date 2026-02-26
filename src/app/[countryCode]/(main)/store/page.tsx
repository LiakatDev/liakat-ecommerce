import { Metadata } from "next"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@/modules/store/templates"
import { buildMetadata } from "@/lib/build-metadata"

export const PRODUCT_LIMIT = 12

type PageProps = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  const metadata = await buildMetadata(
    countryCode,
    `/store`,
    `Shop | FLATLIST Eyewear`,
    `Shop all our products`,
    {
      openGraph: {
        title: `Shop | FLATLIST Eyewear`,
        description: `Shop all our products`,
      },
    }
  )

  return metadata
}

export default async function StorePage({ searchParams, params }: PageProps) {
  const { countryCode } = await params
  const sp = await searchParams

  const sortBy = sp?.sortBy
  const page = sp?.page

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
