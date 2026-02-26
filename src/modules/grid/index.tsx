import {
  GridItemType,
  calculateGridPositions,
} from "@/lib/util/calculate-block-position"
import { GridItem } from "./components/item"

const GridRow = ({ blocks }: { blocks: GridItemType[] }) => {
  const positionedBlocks = calculateGridPositions(blocks)

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 md:grid-rows-4 gap-x-2 gap-y-2 transition-all duration-300`}
    >
      {positionedBlocks.map((b, i: number) => {
        if (!b.image && !b.title && !b.subtitle) {
          return null
        }
        return <GridItem block={b} key={i} />
      })}
    </div>
  )
}

export { GridRow }
