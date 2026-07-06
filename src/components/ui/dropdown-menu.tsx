import * as React from "react"
import {
  Root as DropdownMenuPrimitiveRoot,
  Trigger as DropdownMenuPrimitiveTrigger,
  Content as DropdownMenuPrimitiveContent,
  Item as DropdownMenuPrimitiveItem,
  Separator as DropdownMenuPrimitiveSeparator,
  Portal as DropdownMenuPrimitivePortal,
} from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRoot>) {
  return <DropdownMenuPrimitiveRoot data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveTrigger>) {
  return (
    <DropdownMenuPrimitiveTrigger
      data-slot="dropdown-menu-trigger"
      className={cn("cursor-pointer outline-none", className)}
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveContent>) {
  return (
    <DropdownMenuPrimitivePortal>
      <DropdownMenuPrimitiveContent
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-36 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitivePortal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveItem>) {
  return (
    <DropdownMenuPrimitiveItem
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 px-3 py-1.5 text-sm outline-none select-none transition-colors duration-100 data-disabled:pointer-events-none data-disabled:opacity-50 focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveSeparator>) {
  return (
    <DropdownMenuPrimitiveSeparator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
