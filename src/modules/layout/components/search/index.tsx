"use client"

import { useToggleState } from "@medusajs/ui"
import Modal from "@/modules/common/components/modal"
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useState } from "react"

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`

  return `${pathname}${queryString}`
}

export default function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { state, open, close: closeModal } = useToggleState(false)

  const [value, setValue] = useState<string>("")

  const close = () => {
    closeModal()
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newParams = new URLSearchParams(searchParams.toString())

    if (value) {
      newParams.set("q", value)
    } else {
      newParams.delete("q")
    }

    router.push(createUrl("/search", newParams))
    close()
    setValue("")
  }

  return (
    <>
      <div className="nav-cart-link cursor-pointer" onClick={open}>
        Search
      </div>
      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <form
          onSubmit={onSubmit}
          className="w-max-[200px] w-full p-0 flatlist-text-input relative"
        >
          <Modal.Body>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search..."
              key={searchParams?.get("q")}
              type="text"
              autoComplete="off"
              defaultValue={searchParams?.get("q") || ""}
              className="w-full outline-none flatlist-text-input"
            />
            {value && (
              <button
                className="flatlist-micro-title absolute right-0 top-0"
                type="submit"
              >
                Enter
              </button>
            )}
          </Modal.Body>
        </form>
      </Modal>
    </>
  )
}
