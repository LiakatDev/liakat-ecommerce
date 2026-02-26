import { Metadata } from "next"

import InteractiveLink from "@/modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 p-8 items-center justify-center min-h-[calc(80vh-38px)] max-w-xl m-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <h1 className="flatlist-medium-title font-america text-center mb-6">
        We could not find the page you were looking for.
      </h1>
      <p className="flatlist-mini-title font-america">
        Are you looking for any of these pages perhaps?
      </p>
      <div className="flatlist-text-link font-america flex flex-row gap-3">
        <InteractiveLink href="/">{"> "}Frontpage</InteractiveLink>
        <InteractiveLink href="/">{"> "}All products</InteractiveLink>
        <InteractiveLink href="/">{"> "}Eyewear</InteractiveLink>
        <InteractiveLink href="/">{"> "}Cart</InteractiveLink>
        <InteractiveLink href="/">{"> "}Checkout</InteractiveLink>
      </div>
    </div>
  )
}
