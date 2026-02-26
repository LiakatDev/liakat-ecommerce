import SkeletonButton from "@/modules/skeletons/components/skeleton-button"
import SkeletonHeading from "@/modules/skeletons/components/skeleton-heading"
import SkeletonImage from "@/modules/skeletons/components/skeleton-image"
import SkeletonPrice from "@/modules/skeletons/components/skeleton-price"
import ProductParagraph from "@/modules/skeletons/components/skeleton-product-paragraph"

const SkeletonProductPage = () => {
  return (
    <div
      className="grid small:grid-cols-2 h-[100%] gap-3 p-6 pt-7"
      data-testid="products-container-loader"
    >
      <div className="w-full">
        <div className="overflow-y-scroll no-scrollbar">
          <SkeletonImage />
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col sticky top-[130px]">
          <SkeletonHeading />
          <div className="flex flex-row w-full">
            <div className="hidden small:block w-full mt-24">
              <ProductParagraph />
            </div>
            <div className="flex flex-col items-end w-full -mt-[40px]">
              <SkeletonPrice />
              <SkeletonButton />
            </div>
          </div>
          <div className="small:hidden block w-full mt-4">
            <ProductParagraph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPage
