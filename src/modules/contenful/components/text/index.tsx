import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { renderingOptions } from "@/lib/contentful/rendering/renderingOptions"

interface MasonryTextLayoutProps {
  elements?: React.ReactElement[] | null
}

const MasonryTextLayout: React.FC<MasonryTextLayoutProps> = ({ elements }) => {
  return (
    <div className="flex flex-wrap justify-between">
      {elements?.map((element, index) => (
        <div key={index} className="flex-1">
          <div className="h-full flex items-end hyphens-auto px-1.5">
            {element}
          </div>
        </div>
      ))}
    </div>
  )
}

export async function RichText({
  content,
  columns = false,
}: {
  content: any
  columns?: boolean
}) {
  const elements: any = documentToReactComponents(content, renderingOptions)

  if (columns) {
    return <MasonryTextLayout elements={elements} />
  }

  return (
    <div className="flex flex-col space-y-4 max-w-prose px-6">{elements}</div>
  )
}

export default RichText
