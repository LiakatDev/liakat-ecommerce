import * as React from "react"
import { Metadata } from "next"

import Footer from "@/modules/layout/templates/footer"
import Nav from "@/modules/layout/templates/nav"
import { getSiteConfig } from "@/lib/contentful"
import { listRegions } from "@/lib/data/regions"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <React.Suspense>
      <Layout>{props.children}</Layout>
    </React.Suspense>
  )
}

async function Layout({ children }: { children: React.ReactNode }) {
  const regions = await listRegions()
  const config = await getSiteConfig(process.env.CONTENTFUL_CONFIG_ID!).catch(
    () => null
  )

  return (
    <NuqsAdapter>
      <Nav config={config} />
      <main className="2 h-full mt-[43px]">{children}</main>
      <Footer config={config} regions={regions} />
    </NuqsAdapter>
  )
}
