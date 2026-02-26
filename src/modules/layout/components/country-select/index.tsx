"use client"

import { useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@/lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { Select } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { updateRegion } from "@/lib/data/cart"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent({
        country: option?.country ?? "",
        region: option?.region ?? "",
        label: option?.label ?? "",
      })
    }
  }, [options, countryCode])

  const handleChange = (option: string) => {
    updateRegion(option, currentPath)
    close()
  }

  return (
    <div>
      <div className="flatlist-mini-text flex items-center space-x-6 md:justify-end">
        <div className="hidden md:block w-[100px]">Shipping to</div>
        <div className="w-[150px]">
          <Select onValueChange={handleChange} value={current?.country}>
            <Select.Trigger className="py-0 pr-0 pl-2 bg-transparent rounded-none shadow-none outline-0 active:outline-0 focus:outline-0">
              <Select.Value placeholder="Country" />
            </Select.Trigger>
            <Select.Content className="rounded-none bg-white border border-black">
              {options?.map((o, index) => {
                return (
                  <>
                    <Select.Item
                      key={index}
                      value={o?.country ?? ""}
                      className="rounded-none"
                    >
                      <ReactCountryFlag
                        svg
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                        countryCode={o?.country ?? ""}
                      />{" "}
                      {o?.label}
                    </Select.Item>
                  </>
                )
              })}
            </Select.Content>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default CountrySelect
