import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@/modules/account/components/address-book"

import { headers } from "next/headers"
import { getRegion } from "@/lib/data/regions"
import { retrieveCustomer } from "@/lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses() {
  const nextHeaders = await headers()
  const countryCode = nextHeaders.get("next-url")?.split("/")[1] || ""

  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="flatlist-mini-title-bold">Shipping Addresses</h1>
        <p className="flatlist-text">
          View and update your shipping addresses.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
