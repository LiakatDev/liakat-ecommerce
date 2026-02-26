export type GridItemType = {
  width: number
  height: number
  start: number
  title?: string
  subtitle?: string
  target?: { label: string; destination: string }
  image?: {
    url: string
    width: number
    height: number
  }
}

export type PositionedGridItem = GridItemType & {
  colStart: number
  colEnd: number
  rowStart: number
  rowEnd: number
}

export const calculateGridPositions = (
  blocks: GridItemType[]
): PositionedGridItem[] => {
  const maxColumns = 12
  const maxRows = 4
  const positionedBlocks: PositionedGridItem[] = []
  let currentColumn = 1
  let currentRow = 1

  for (const block of blocks) {
    if (currentColumn + block.width - 1 > maxColumns) {
      currentColumn = 1
      currentRow++
    }

    if (currentRow > maxRows) {
      console.warn(`Block exceeds grid height and will be skipped:`, block)
      continue
    }

    const colStart = currentColumn
    const colEnd = colStart + block.width
    const rowStart = block.start
    const rowEnd = rowStart + block.height

    if (rowEnd > maxRows + 1) {
      console.warn(`Block exceeds grid row span and will be skipped:`, block)
      continue
    }

    positionedBlocks.push({
      ...block,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
    })

    currentColumn = colEnd

    if (currentColumn > maxColumns) {
      currentColumn = 1
      currentRow++
    }
  }

  return positionedBlocks
}
