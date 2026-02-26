"use client"

import { HttpTypes } from "@medusajs/types"
import OrderCard from "../order-card"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-left gap-y-4"
      data-testid="no-orders-container"
    >
      <p className="flatlist-text">You have no orders yet</p>
    </div>
  )
}

export default OrderOverview
