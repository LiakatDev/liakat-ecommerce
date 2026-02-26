import { InfiniteProductPage } from "types/global"

const getNumberOfSkeletons = (pages?: InfiniteProductPage[]) => {
  if (!pages) {
    return 0
  }

  const count = pages[pages.length - 1].response.count
  const retrieved =
    count - pages.reduce((acc, curr) => acc + curr.response.products.length, 0)

  if (count - retrieved < 12) {
    return count - retrieved
  }

  return 12
}

export default getNumberOfSkeletons
