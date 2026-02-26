"use client"

import { Select } from "@medusajs/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Lowest price first" },
  { value: "price_desc", label: "Highest price first" },
]

const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  return (
    <div className="w-[150px]">
      {/* @ts-ignore */}
      <Select onValueChange={handleChange} value={sortBy}>
        <Select.Trigger className="bg-transparent border border-black rounded-none shadow-none outline-0 active:outline-0 focus:outline-0">
          <Select.Value placeholder="Sort by" />
        </Select.Trigger>

        <Select.Content className="rounded-none bg-white border border-black">
          {sortOptions.map((item) => (
            <Select.Item
              key={item.value}
              value={item.value}
              className="rounded-none"
            >
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default SortProducts
