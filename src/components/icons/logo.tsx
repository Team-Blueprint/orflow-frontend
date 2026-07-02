export function LogoIcon({ size = 20, variant = "orange", className }: { size?: number; variant?: "orange" | "white"; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" fill="#09090b" rx="0" />
      <path
        d="M8 12H20V24M24 20H12V8"
        stroke={variant === "orange" ? "#f97316" : "#fafafa"}
        strokeWidth="3"
        strokeLinecap="square"
      />
    </svg>
  )
}
