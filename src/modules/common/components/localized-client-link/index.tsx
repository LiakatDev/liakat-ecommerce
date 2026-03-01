"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

type Props = {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}

/**
 * Safe Localized Link
 * ✅ Prevents /dk/dk/store
 * ✅ Works with external links
 * ✅ Safe when countryCode missing
 */
const LocalizedClientLink = ({ children, href, ...props }: Props) => {
  const params = useParams() as { countryCode?: string }
  const countryCode = (params?.countryCode || "").toString()

  // External link (http/https)
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  const cleanHref = href.startsWith("/") ? href : `/${href}`

  // If no countryCode (edge cases)
  if (!countryCode) {
    return (
      <Link href={cleanHref} {...props}>
        {children}
      </Link>
    )
  }

  const prefix = `/${countryCode}`

  // If already prefixed -> don't duplicate
  if (cleanHref === prefix || cleanHref.startsWith(`${prefix}/`)) {
    return (
      <Link href={cleanHref} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <Link href={`${prefix}${cleanHref}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink