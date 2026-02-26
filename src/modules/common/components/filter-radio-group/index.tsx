import { Label, RadioGroup, clx } from "@medusajs/ui"
import { ChangeEvent } from "react"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-row gap-x-3 gap-y-3 w-full">
      <RadioGroup data-testid={dataTestId} className="flex flex-col">
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center", {
              "ml-[0]": i.value === value,
            })}
          >
            {i.value === value}
            <RadioGroup.Item
              checked={i.value === value}
              onClick={(e) =>
                handleChange(
                  e as unknown as ChangeEvent<HTMLButtonElement>,
                  i.value
                )
              }
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "flatlist-micro-title text-black/25 hover:text-black hover:cursor-pointer",
                {
                  "flatlist-micro-title text-black": i.value === value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
