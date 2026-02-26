import LocalizedClientLink from "@/modules/common/components/localized-client-link"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mb-2 w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink className="hover:text-ui-fg-base" href="/">
            <img
              src="https://images.ctfassets.net/ug87367u0m7l/5arI3EsG4mUEjEhbUUuwJ9/b1dde890e948d422fa1c0c909ad897b6/BC7155AC-398B-49AC-B86E-7821D52CE463.png?h=250"
              className="w-24"
            />
          </LocalizedClientLink>
        </nav>
      </div>
      <div className="relative bg-white" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
