import { Container } from "@medusajs/ui"

import ChevronDown from "@/modules/common/icons/chevron-down"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@/lib/util/money"
import Link from "next/link"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning,"
  if (hour < 17) return "Good afternoon,"
  return "Good evening,"
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flatlist-mini-title flex justify-between items-center mb-12">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            {getTimeBasedGreeting()} {customer?.first_name}
          </span>
        </div>

        <div className="flex flex-col mb-36">
          <div className="w-full flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <h3 className="flatlist-text-bold uppercase">Recent orders</h3>
            </div>
            <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => {
                  return (
                    <li
                      key={order.id}
                      data-testid="order-wrapper"
                      data-value={order.id}
                    >
                      <LocalizedClientLink
                        href={`/account/orders/details/${order.id}`}
                      >
                        <Container className="bg-gray-50 flex justify-between items-center p-4">
                          <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                            <span className="flatlist-text">Date placed</span>
                            <span className="flatlist-text">Order number</span>
                            <span className="flatlist-text">Total amount</span>
                            <span data-testid="order-created-date">
                              {new Date(order.created_at).toDateString()}
                            </span>
                            <span
                              data-testid="order-id"
                              data-value={order.display_id}
                            >
                              #{order.display_id}
                            </span>
                            <span data-testid="order-amount">
                              {convertToLocale({
                                amount: order.total,
                                currency_code: order.currency_code,
                              })}
                            </span>
                          </div>
                          <button
                            className="flex items-center justify-between"
                            data-testid="open-order-button"
                          >
                            <span className="sr-only">
                              Go to order #{order.display_id}
                            </span>
                            <ChevronDown className="-rotate-90" />
                          </button>
                        </Container>
                      </LocalizedClientLink>
                    </li>
                  )
                })
              ) : (
                <>
                  <span
                    data-testid="no-orders-message"
                    className="flatlist-text"
                  >
                    No recent orders
                  </span>
                  <Link
                    className="flatlist-text underline"
                    href="/account/orders"
                  >
                    See all your orders
                  </Link>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col py-8">
          <div className="w-full flex flex-col items-end gap-y-4">
            <span className="flatlist-micro-title">
              Signed in as:{" "}
              <span
                className="flatlist-micro-title-bold"
                data-testid="customer-email"
                data-value={customer?.email}
              >
                {customer?.email}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
