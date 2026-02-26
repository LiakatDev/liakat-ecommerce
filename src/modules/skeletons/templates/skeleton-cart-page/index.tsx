const SkeletonCartPage = () => {
  return (
    <div className="py-12">
      <div className="content-container p-5">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-x-20">
          <div className="flex flex-col bg-white gap-y-6 mb-6 small:mb-0">
            <div className="w-full max-w-[620px] h-[388px] bg-gray-200 animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-y-8">
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-40">
                <div className="flex flex-row justify-between small:mb-48">
                  <div className="w-[223px] h-[44px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[132px] h-[44px] bg-gray-200 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-end mb-8">
                <div className="w-[312px] h-[48px] bg-gray-200 animate-pulse"></div>
              </div>
              <div className="small:flex-row flex flex-col justify-between">
                <div className="flex w-full items-end">
                  <div className="w-full">
                    <div className="flex w-full flex-row items-end justify-between">
                      <div className="relative flex flex-col">
                        <div className="bg-gray-200 w-[55px] h-[19px] animate-pulse"></div>
                        <div className="bg-gray-200 w-[161px] h-[38px] animate-pulse"></div>
                      </div>
                      <div className="bg-gray-200 w-[55px] h-[19px] justify-center animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-end justify-end space-y-6">
                  <div>
                    <div className="bg-gray-200 w-[100px] h-[19px] animate-pulse"></div>
                  </div>
                  <div>
                    <div className="bg-gray-200 w-[100px] h-[19px] animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div>
                      <div className="bg-gray-200 w-[100px] h-[19px] animate-pulse"></div>
                    </div>
                    <div>
                      <div className="bg-gray-200 w-[150px] h-[19px] items-right flex justify-between animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <div className="w-[312px] h-[48px] bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
