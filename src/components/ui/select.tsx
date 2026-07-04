import * as React from "react"
import {
  Root as SelectPrimitiveRoot,
  Group as SelectPrimitiveGroup,
  Value as SelectPrimitiveValue,
  Trigger as SelectPrimitiveTrigger,
  Content as SelectPrimitiveContent,
  Label as SelectPrimitiveLabel,
  Item as SelectPrimitiveItem,
  Separator as SelectPrimitiveSeparator,
  ScrollUpButton as SelectPrimitiveScrollUpButton,
  ScrollDownButton as SelectPrimitiveScrollDownButton,
  Portal as SelectPrimitivePortal,
  Icon as SelectPrimitiveIcon,
  Viewport as SelectPrimitiveViewport,
  ItemIndicator as SelectPrimitiveItemIndicator,
  ItemText as SelectPrimitiveItemText
} from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { AltArrowDown } from "@/lib/icons"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitiveRoot>) {
  return <SelectPrimitiveRoot data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveGroup>) {
  return (
    <SelectPrimitiveGroup
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitiveValue>) {
  return <SelectPrimitiveValue data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveTrigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitiveTrigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 border border-input bg-canvas px-3 py-2 text-sm text-ink whitespace-nowrap transition-all duration-100 outline-none select-none focus:border-transparent focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-ink-soft data-[size=default]:h-10 data-[size=sm]:h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitiveIcon asChild>
        <AltArrowDown className="pointer-events-none size-4 text-ink-soft" />
      </SelectPrimitiveIcon>
    </SelectPrimitiveTrigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitiveContent>) {
  return (
    <SelectPrimitivePortal>
      <SelectPrimitiveContent
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitiveViewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitiveViewport>
        <SelectScrollDownButton />
      </SelectPrimitiveContent>
    </SelectPrimitivePortal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveLabel>) {
  return (
    <SelectPrimitiveLabel
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-xs text-ink-soft", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveItem>) {
  return (
    <SelectPrimitiveItem
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitiveItemIndicator>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </SelectPrimitiveItemIndicator>
      </span>
      <SelectPrimitiveItemText>{children}</SelectPrimitiveItemText>
    </SelectPrimitiveItem>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveSeparator>) {
  return (
    <SelectPrimitiveSeparator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveScrollUpButton>) {
  return (
    <SelectPrimitiveScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </SelectPrimitiveScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitiveScrollDownButton>) {
  return (
    <SelectPrimitiveScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </SelectPrimitiveScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
