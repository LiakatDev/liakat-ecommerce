"use client"

import { Disclosure } from "@headlessui/react"
import { useEffect } from "react"

import useToggleState from "@/lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"
import clsx from "clsx"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="flatlist-text" data-testid={dataTestid}>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="uppercase flatlist-micro-title-bold">{label}</span>
          <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="flatlist-text mt-1" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <button
            className="flatlist-light-button w-fit min-h-[25px] py-1"
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
          >
            <span>{state ? "Cancel" : "Edit"}</span>
          </button>
        </div>
      </div>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="p-2 my-4" color="red">
            <span>{errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-visible",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="flex items-center justify-end mt-2">
              <button
                className="flatlist-dark-button w-full small:max-w-[140px]"
                type="submit"
                data-testid="save-button"
              >
                Save changes
              </button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
