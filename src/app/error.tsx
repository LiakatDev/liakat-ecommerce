"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col gap-4 p-8 items-center justify-center min-h-[calc(80vh-38px)] max-w-xl m-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      <h1 className="flatlist-medium-title font-america mt-4 text-center">
        Our systems encouraged an error
      </h1>

      <div className="flex flex-row gap-3">
        <button
          className="flatlist-text-link font-america text-white mt-4 rounded-sm bg-black px-4 py-2 transition-colors"
          onClick={() => reset()}
        >
          Try again
        </button>
        <button
          className="flatlist-text-link font-america text-black mt-4 rounded-sm border border-black px-4 py-2 transition-colors"
          onClick={() => window.open("/", "_blank")}
        >
          Go to frontpage
        </button>
      </div>

      <div>
        <p className="flatlist-mini-title font-america text-center mt-4">
          If this error persists please reach out to us:
          info@flatlisteyewear.com
        </p>
      </div>
    </div>
  )
}
