// import LocalizedClientLink from "@/modules/common/components/localized-client-link"
// import { SiteConfig } from "types/global"

// export default async function Logo({ config }: { config: SiteConfig }) {
//   return (
//     <LocalizedClientLink href="/" data-testid="nav-store-link">
//       <img src={config.logo.url} alt="FLATLIST" className="h-6 w-auto" />
//     </LocalizedClientLink>
//   )
// }
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { SiteConfig } from "types/global"

export default async function Logo({ config }: { config: SiteConfig | null }) {
  const logoUrl = config?.logo?.url

  // ✅ Contentful config/logo missing হলে crash না করে text দেখাবে
  if (!logoUrl) {
    return (
      <LocalizedClientLink href="/" data-testid="nav-store-link">
        <span className="font-america tracking-wide">FLATLIST</span>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink href="/" data-testid="nav-store-link">
      <img src={logoUrl} alt="FLATLIST" className="h-6 w-auto" />
    </LocalizedClientLink>
  )
}
