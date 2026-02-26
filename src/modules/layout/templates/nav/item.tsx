"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { NavigationItem } from "@/types/global"
import { useState } from "react"

export const MenuItem = ({ item }: { item: NavigationItem }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false)
    }, 100) // Small delay to allow moving to submenu
    setTimeoutId(id)
  }

  return (
    <li
      key={item.sys.id}
      className="relative pt-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <LocalizedClientLink
        href={item.link}
        data-testid={`${item.title.toLowerCase()}-link`}
      >
        {item.title}
      </LocalizedClientLink>

      {/* Sub Navigation Items */}
      {isOpen &&
        item.subItemsCollection &&
        item.subItemsCollection.items.length > 0 && (
          <ul
            className="absolute left-0 top-full mt-2 flex flex-row gap-4 z-50 min-w-[200px] whitespace-nowrap bg-none bg-transparent"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.subItemsCollection.items.map((subItem) => (
              <li key={subItem.sys.id} className="inline-block">
                <LocalizedClientLink
                  href={subItem.link}
                  data-testid={`${subItem.title.toLowerCase()}-link`}
                  className="block"
                >
                  {"> "} {subItem.title}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        )}
    </li>
  )
}
