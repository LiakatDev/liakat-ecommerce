import { Suspense } from "react"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import CartButton from "@/modules/layout/components/cart-button"
import SideMenu from "@/modules/layout/components/side-menu"
import Promotion from "@/modules/layout/components/promotion"
import { SiteConfig } from "types/global"
import Logo from "@/modules/layout/components/logo"
import { MenuItem } from "./item"
import Search from "@/modules/layout/components/search"

export default function Nav({ config }: { config: SiteConfig | null }) {
  const navItems =
    config?.headerNavigation?.navigationItemsCollection?.items ?? []

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-20 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="text-small content-container flex items-center w-full h-full justify-between">
          <div className="w-full flex gap-12 small:gap-20 justify-between items-center small:items-center flatlist-micro-title transition-all duration-500">
            {/* Logo */}
            <Logo config={config as any} />

            {/* Navigation Items */}
            <ul className="flex-1 gap-16 w-fit h-full flex items-start justify-end small:justify-between transition-all duration-500">
              <div className="hidden w-fit small:flex flex-row gap-16 items-start flatlist-micro-title relative pb-4">
                {navItems.map((item) => (
                  <MenuItem key={item.sys.id} item={item} />
                ))}
              </div>

              <ul className="w-fit flex flex-row gap-8 small:gap-8 flatlist-micro-title relative items-center">
                <Search />
                <Suspense
                  fallback={
                    <LocalizedClientLink
                      href="/cart"
                      data-testid="nav-cart-link"
                    >
                      CART (0)
                    </LocalizedClientLink>
                  }
                >
                  <CartButton />
                </Suspense>
              </ul>
            </ul>

            <div className="z-50 small:hidden flex h-full items-start">
              <div className="h-full">
                <SideMenu items={navItems} />
              </div>
            </div>
          </div>
        </nav>
        <Promotion />
      </header>
    </div>
  )
}
