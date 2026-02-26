const Radio = ({
  checked,
  "data-testid": dataTestId,
}: {
  checked: boolean
  "data-testid"?: string
}) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || "radio-button"}
      >
        <div
          className={`${
            !checked ? "bg-transparent" : "bg-black"
          } border border-black flex h-[14px] w-[14px] items-center justify-center rounded-full transition-all`}
        >
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-black rounded-full h-1.5 w-1.5"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
