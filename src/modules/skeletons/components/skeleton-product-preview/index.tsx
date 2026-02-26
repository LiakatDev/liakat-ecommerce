import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <Container className="h-[300px] w-full bg-gray-100 rounded-none border-0 shadow-none" />
    </div>
  )
}

export default SkeletonProductPreview
