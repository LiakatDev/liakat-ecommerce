"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@/lib/constants"
import { initiatePaymentSession } from "@/lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@/modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@/modules/checkout/components/payment-container"
import Divider from "@/modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { StorePaymentProvider } from "@medusajs/types"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: StorePaymentProvider[]
}) => {
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  // ✅ keep the existing selection if there's an active session
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // ✅ DO NOT filter out pp_system_default
  const methods = useMemo(() => {
    return Array.isArray(availablePaymentMethods) ? availablePaymentMethods : []
  }, [availablePaymentMethods])

  // ✅ Auto-select first method if none selected (prevents empty state)
  useEffect(() => {
    if (!selectedPaymentMethod && methods.length) {
      setSelectedPaymentMethod(methods[0].id)
    }
  }, [methods, selectedPaymentMethod])

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Payment step should be ready when shipping selected (or giftcard paid)
  const paymentReady =
    (cart && cart?.shipping_methods?.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    // ✅ If stripe selected, create a session (like before)
    if (isStripeFunc(method)) {
      try {
        await initiatePaymentSession(cart, { provider_id: method })
      } catch (err: any) {
        setError(err?.message || "Failed to initiate payment session")
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!selectedPaymentMethod && !paidByGiftcard) {
        throw new Error("Please select a payment method")
      }

      // If current active session isn't for selected method, create/update session
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && selectedPaymentMethod) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // If stripe: user needs to input card details in Stripe container
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      // If not stripe input step -> go review directly
      if (!shouldInputCard) {
        return router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const hasMethods = methods.length > 0

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>

        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      <div>
        {/* OPEN VIEW */}
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (
            <>
              {!hasMethods ? (
                <Text className="txt-medium text-ui-fg-subtle">
                  No payment methods available for this region.
                </Text>
              ) : (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                >
                  {methods.map((paymentMethod) => (
                    <div key={paymentMethod.id}>
                      {isStripeFunc(paymentMethod.id) ? (
                        <StripeCardContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                          setCardBrand={setCardBrand}
                          setError={setError}
                          setCardComplete={setCardComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage error={error} data-testid="payment-method-error-message" />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (!paidByGiftcard && !hasMethods) ||
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? "Enter card details"
              : "Continue to review"}
          </Button>
        </div>

        {/* CLOSED SUMMARY VIEW */}
        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>

              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
