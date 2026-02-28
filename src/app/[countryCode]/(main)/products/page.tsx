import { HttpTypes } from "@medusajs/types"
import { Metadata } from "next"
import Link from "next/link"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

const PUBLISHABLE_API_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const metadata: Metadata = {
  title: "Products",
}

async function getProducts(countryCode: string) {
  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) return []

  const res = await fetch(
    `${BACKEND_URL}/store/products?limit=24&fields=id,title,handle,thumbnail`,
    {
      headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
      // products list cache (you can change)
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  return (data?.products || []) as HttpTypes.StoreProduct[]
}

export default async function ProductsPage({
  params,
}: {
  params: { countryCode: string }
}) {
  const countryCode = params.countryCode?.toLowerCase()
  const products = await getProducts(countryCode)

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Products</h1>

      {!products.length ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/${countryCode}/products/${p.handle}`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  background: "#f3f4f6",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnail}
                    alt={p.title || "Product"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  "No image"
                )}
              </div>

              <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{p.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
