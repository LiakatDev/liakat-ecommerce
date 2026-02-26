import { Metadata } from "next"

import InteractiveLink from "@/modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="h-screen w-full">
      <div className="m-auto h-full flex flex-col gap-4 p-8 items-center justify-center max-w-xl">
        <h1 className="flatlist-medium-title-bold text-center mb-6">
          We tried but could not find that page for you.
        </h1>
        <p className="flatlist-text text-center mb-6">
          Is there a chance you were looking for one of these pages perhaps?
        </p>
        <div className="flatlist-text uppercase flex flex-row gap-3">
          <InteractiveLink href="/">{"> "}Frontpage</InteractiveLink>
          <InteractiveLink href="/store">{"> "}All products</InteractiveLink>
          <InteractiveLink href="/">{"> "}Eyewear</InteractiveLink>
          <InteractiveLink href="/">{"> "}Cart</InteractiveLink>
          <InteractiveLink href="/">{"> "}Checkout</InteractiveLink>
        </div>
      </div>
    </div>
  )
}
