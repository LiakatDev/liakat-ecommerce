const SkeletonHeading = () => {
  return (
    <div className="flex flex-col animate-pulse gap-y-2">
      <div className="h-12 w-[100px] bg-gray-100 rounded-none border-0 shadow-none" />
      <div className="h-12 w-[280px] bg-gray-100 rounded-none border-0 shadow-none" />
      <div className="h-12 w-[320px] bg-gray-100 rounded-none border-0 shadow-none" />
      <div className="h-12 w-[280px] bg-gray-100 rounded-none border-0 shadow-none" />
    </div>
  )
}

export default SkeletonHeading
