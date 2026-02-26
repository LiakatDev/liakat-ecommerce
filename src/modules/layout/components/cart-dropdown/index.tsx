"use client"

import { Popover, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import DeleteButton from "@/modules/common/components/delete-button"
import LineItemPrice from "@/modules/common/components/line-item-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@/lib/util/money"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState<boolean>(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer as unknown as number)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer as unknown as number)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-fit z-50 whitespace-nowrap"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <Popover.Button className="h-full">
          <LocalizedClientLink
            className="uppercase"
            href="/cart"
            data-testid="nav-cart-link"
          >{`Cart (${totalItems})`}</LocalizedClientLink>
        </Popover.Button>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="mt-[22.5px] p-4 overflow-hidden hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-t border-black w-[420px] h-[90vh] flatlist-mini-text"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-start mb-3">
              <h3 className="flatlist-mini-title uppercase">Cart</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="max-h-screen overflow-auto pb-80 grid grid-cols-1 gap-y-2 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? 0) > (b.created_at ?? 0) ? -1 : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-2 gap-3"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-full"
                        >
                          <Image
                            src={item.thumbnail ?? ""}
                            alt={item.title}
                            width={300}
                            height={300}
                            className="w-40 h-40 object-cover object-center"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-col">
                          <div className="flex items-start">
                            <div className="flex flex-col w-[180px]">
                              <div className="overflow-ellipsis whitespace-nowrap">
                                <h3 className="flatlist-micro-title-bold text-ellipsis w-fit text-wrap small:mb-2">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                              </div>
                              <div className="w-full flex flex-row justify-between items-end">
                                <div className="flex flex-col">
                                  <span
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    {item.quantity} pcs.
                                  </span>
                                  <LineItemPrice
                                    currencyCode={cartState.currency_code}
                                    item={item}
                                    style="tight"
                                  />
                                </div>
                                <DeleteButton
                                  id={item.id}
                                  className="flatlist-mini-title uppercase scale-50"
                                  data-testid="cart-item-remove-button"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="absolute flex flex-col gap-2 bottom-3 w-[92%]">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2 flatlist-mini-title">
                      <span>
                        Subtotal <span>(excl. taxes)</span>
                      </span>
                      <span
                        data-testid="cart-subtotal"
                        data-value={cartState.subtotal || 0}
                      >
                        {convertToLocale({
                          amount: cartState.subtotal || 0,
                          currency_code: cartState.region!.currency_code,
                        })}
                      </span>
                    </div>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <button
                      className="flatlist-dark-button w-full"
                      data-testid="go-to-cart-button"
                    >
                      Go to cart
                    </button>
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href={"/checkout?step=address"}
                    data-testid="checkout-button"
                  >
                    <button
                      className="flatlist-light-button w-full"
                      data-testid="go-to-checkout-button"
                    >
                      Go to checkout
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-col m-auto">
                  <span className="flatlist-mini-title text-center">
                    The cart is empty.
                  </span>
                  <div className="absolute flex flex-col gap-2 bottom-3 w-[92%]">
                    <LocalizedClientLink href="/store">
                      <>
                        <button
                          className="flatlist-dark-button"
                          data-testid="go-to-frontpage-button"
                          onClick={close}
                        >
                          Go shop
                        </button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
