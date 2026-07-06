import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border border-input bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none transition-all duration-100 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-primary",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
