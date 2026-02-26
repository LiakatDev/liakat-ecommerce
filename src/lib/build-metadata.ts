import { Metadata } from "next"
import { flatten } from "lodash"
import { listRegions } from "./data/regions"
import { HttpTypes } from "@medusajs/types"

export async function buildMetadata(
  countryCode: string,
  path: string,
  title: string,
  description: string,
  ...rest: any
): Promise<Metadata> {
  const regions = await listRegions()

  let countries: string[] = ["dk"]

  if (regions) {
    countries = flatten<string>(
      regions
        ?.map(
          (region: HttpTypes.StoreRegion) =>
            region.countries?.map((country) => country.iso_2) ?? []
        )
        .filter((arr): arr is string[] => arr !== undefined) ?? []
    )
  }

  return {
    title,
    description,
    ...rest,
    alternates: {
      canonical: `https://flatlisteyewear.com/${countryCode}${path}`,
      languages: {
        ...countries.reduce<Record<string, string>>((acc, country: string) => {
          acc[`en-${country.toUpperCase()}`] =
            `https://flatlisteyewear.com/${country}${path}`
          return acc
        }, {}),
      },
    },
  }
}
