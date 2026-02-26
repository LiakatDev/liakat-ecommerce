import React, { ReactNode } from "react"
import Link from "next/link"
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"

export const renderingOptions = {
  renderMark: {
    [MARKS.ITALIC]: (text: any) => <p className="italic">{text}</p>,
    [MARKS.BOLD]: (text: any) => <strong>{text}</strong>,
  },
  renderText: (text: any) =>
    text.split("\n").flatMap((text: any, i: number) => [i > 0 && <br />, text]),
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      return <p className="flatlist-mini-text text-justify">{children}</p>
    },
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="flatlist-h1">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="flatlist-h2 pb-8">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="flatlist-text px-4 lg:px-0">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="flatlist-text mb-2 leading-none px-4 lg:px-0">
        {children}
      </ul>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => {
      const link = node.data.uri
      const isExternal = link.startsWith("http") || link.startsWith("mailto:")

      if (isExternal) {
        return (
          <a
            href={link}
            target="_blank"
            className="flatlist-text underline hover:no-underline transition-opacity"
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          href={link}
          className="flatlist-text underline hover:no-underline transition-opacity"
        >
          {children}
        </Link>
      )
    },
  },
}
