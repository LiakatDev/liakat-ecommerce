"use client"

import { useToggleState } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import CountrySelect from "@/modules/layout/components/country-select"
import { SiteConfig } from "types/global"
import { HttpTypes } from "@medusajs/types"

export default function Footer({
  config,
  regions,
}: {
  config: SiteConfig | null
  regions: HttpTypes.StoreRegion[] | null
}) {
  const toggleState = useToggleState()

  // ✅ null-safe fallbacks (emergency fix)
  const footerSections = config?.footerSectionsCollection?.items ?? []
  const instagramLink = config?.instagramLink ?? "/"
  const copyrightText = config?.copyrightText ?? ""

  // If config is missing completely, don't crash the app
  if (!config) return null

  return (
    <footer className="border-t border-[#000000] w-full">
      <div className="content-container flex flex-col w-full pt-14 pb-4">
        <ul className="grid grid-cols-1 md:grid-cols-4 md:gap-24 gap-8 items-end">
          {footerSections.map((fS, i) => {
            const navItems = fS?.navigationItemsCollection?.items ?? []
            return (
<div key={`${i}-${fS?.internalName ?? "section"}`} className="flex flex-col gap-4 sm:justify-between">
                <span className="flatlist-mini-title">{fS?.internalName ?? ""}</span>

                <div>
                  {navItems.map((item) => (
                    <li key={`${i}-${item?.title ?? "item"}-${item?.link ?? ""}`} className="w-fit">

                      <LocalizedClientLink href={item?.link ?? "/"}>
                        <div className="flatlist-text-link">{item?.title ?? ""}</div>
                      </LocalizedClientLink>
                    </li>
                  ))}
                </div>
              </div>
            )
          })}

          <li className="w-full flex md:justify-end">
            <LocalizedClientLink href={instagramLink}>
              <div className="flatlist-text-link uppercase">Instagram</div>
            </LocalizedClientLink>
          </li>
        </ul>

        <div className="w-full pt-12 flex items-center justify-between">
          <div className="flatlist-micro-title uppercase">{copyrightText}</div>
          {regions && <CountrySelect toggleState={toggleState} regions={regions} />}
        </div>
      </div>
    </footer>
  )
}
