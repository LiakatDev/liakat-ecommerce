import ContentfulImage from "@/modules/contenful/components/image"
import RichText from "@/modules/contenful/components/text"
import { GridRow } from "@/modules/grid"

export function renderContent(block: { __typename: string } & any) {
  switch (block.__typename) {
    case "GridRow":
      return <GridRow blocks={block.blocksCollection.items} />
    case "Text":
      return <RichText content={block.content.json} columns={block.columns} />
    case "Image":
      return (
        <ContentfulImage
          image={block.image}
          altText={block.altText}
          target={block.target}
        />
      )
  }
}
