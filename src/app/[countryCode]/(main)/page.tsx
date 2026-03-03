import { redirect } from "next/navigation"

type Props = {
  params: { countryCode: string }
}

export default function MainRootPage({ params }: Props) {
  redirect(`/${params.countryCode}/store`)
}