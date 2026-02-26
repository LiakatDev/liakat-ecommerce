"use client"

import { Popover, Transition } from "@headlessui/react"
import { BarsThree, XMark } from "@medusajs/icons"
import { Fragment } from "react"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { NavigationItem } from "types/global"

const SideMenu = ({ items }: { items: NavigationItem[] }) => {
  return (
    <div className="h-full z-50">
      <div className="flex h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex transition-all ease-out duration-200 focus:outline-none hover:flatlist-mini-text"
                >
                  <BarsThree className="scale-150" />
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <Popover.Panel className="flex flex-col absolute w-4/6 h-[calc(100vh)] z-30 right-0 top-0 overflow-hidden">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[#414042] text-white justify-start p-3 pr-5 pt-3"
                  >
                    <div
                      className="flex justify-end text-black mb-2"
                      id="xmark"
                    >
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark className="scale-150 text-white" />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-4 flatlist-mini-title w-full items-start justify-start pt-4">
                      {items.map((item) => {
                        return (
                          <li key={item.link} className="w-full">
                            <LocalizedClientLink
                              href={item.link}
                              className="flex justify-between"
                              onClick={close}
                              data-testid={`${item.title.toLowerCase()}-link`}
                            >
                              {item.title}
                              <span>{">"}</span>
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                      <div className="flex flex-col gap-1 w-full pt-8">
                        <LocalizedClientLink
                          className="flex flatlist-sidebar-link justify-between"
                          href="/cart"
                          scroll={false}
                          data-testid="nav-search-link"
                        >
                          Cart (0)
                          <span>{">"}</span>
                        </LocalizedClientLink>
                      </div>
                    </ul>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
