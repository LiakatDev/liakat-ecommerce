import { redirect } from "next/navigation"

type Props = {
  params: { countryCode: string }
}

export default function CountryRootPage({ params }: Props) {
  redirect(`/${params.countryCode}/store`)
}
