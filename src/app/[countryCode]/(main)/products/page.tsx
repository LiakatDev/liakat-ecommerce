import { redirect } from "next/navigation"

export default function ProductsPage({
  params,
}: {
  params: { countryCode: string }
}) {
  // Emergency: use existing search page as product listing
  redirect(`/${params.countryCode}/search`)
}