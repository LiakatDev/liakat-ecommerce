import { useFormState } from "react-dom"

import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import Input from "@/modules/common/components/input"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import { login } from "@/lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-left"
      data-testid="login-page"
    >
      <h1 className="flatlist-mini-title-bold uppercase mb-6">
        MEMBERSHIP LOGIN
      </h1>
      <p className="text-left flatlist-text mb-8">
        Log in with your e-mailadress or register to become a member.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="flatlist-dark-button w-full mt-6"
          variant="transparent"
        >
          Sign in
        </SubmitButton>
      </form>
      <span className="text-left flatlist-text text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Create account
        </button>
      </span>
    </div>
  )
}

export default Login
