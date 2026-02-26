"use client"

const Promotion = () => {
  return (
    <div className="sticky top-0 inset-x-0 z-40 group">
      <header className="relative h-11 mx-auto duration-200 bg-white border border-[#000000] border-y-1 border-x-0">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center gap-12 justify-end cursor-pointer">
            <div
              className="flatlist-micro-title transition-all duration-300 cursor-pointer"
              data-testid="nav-store-link"
              onClick={() => {
                window._klForms = window._klForms || []
                window._klForms.push("VMwg4T")
                window._klOnsite = window._klOnsite || []
                window._klOnsite.push(["openForm", "VMwg4T"])
              }}
            >
              Receive special offers and first look at new products.
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Promotion
