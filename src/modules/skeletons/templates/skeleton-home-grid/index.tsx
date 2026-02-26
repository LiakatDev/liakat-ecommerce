import SkeletonImageMini from "@/modules/skeletons/components/skeleton-image-mini"
import SkeletonImageSmall from "@/modules/skeletons/components/skeleton-image-small"

const SkeletonHomeGrid = () => {
  return (
    <div className="p-5 grid grid-cols-12 grid-rows-12 gap-2 overflow-hidden">
      <div className="col-span-4 row-span-3">
        <SkeletonImageSmall />
      </div>
      <div className="col-span-4 row-span-3 col-start-7">
        <SkeletonImageSmall />
      </div>
      <div className="col-span-2 row-span-3 col-start-11">
        <SkeletonImageMini />
      </div>

      <div className="col-span-2 row-span-3 row-start-4">
        <SkeletonImageMini />
      </div>
      <div className="col-span-4 row-span-3 col-start-5 row-start-4">
        <SkeletonImageSmall />
      </div>

      <div className="col-span-4 row-span-3 row-start-7">
        <SkeletonImageSmall />
      </div>
      <div className="col-span-2 row-span-3 col-start-8 row-start-7">
        <SkeletonImageMini />
      </div>

      <div className="col-span-2 row-span-3 row-start-10">
        <SkeletonImageMini />
      </div>
      <div className="col-span-4 row-span-3 col-start-8 row-start-10">
        <SkeletonImageSmall />
      </div>
    </div>
  )
}

export default SkeletonHomeGrid
