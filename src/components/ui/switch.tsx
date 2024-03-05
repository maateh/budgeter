"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer shadow-md items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted/75"
      },
      size: {
        default: "h-6 w-10",
        sm: "h-5 w-8",
        lg: "h-7 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  customThumb?: React.ReactNode
  tooltip?: {
    checked: string
    unchecked: string
  }
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, variant, size, customThumb, tooltip, checked, ...props }, ref) => {
  const element = (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ className, variant, size }))}
      checked={checked}
      ref={ref}
      {...props}
    >
      {customThumb || <SwitchThumb size={size} />}
    </SwitchPrimitives.Root>
  )

  return !tooltip ? element : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {element}
        </TooltipTrigger>
        <TooltipContent className="tracking-wide">
          {checked ? tooltip.checked : tooltip.unchecked}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full shadow-md ring-0 transition-transform",
  {
    variants: {
      variant: {
        default: "bg-background/85 dark:bg-foreground/85",
        custom: ""
      },
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        sm: "h-4 w-4 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface SwitchThumbProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb>,
    VariantProps<typeof switchThumbVariants> {
  checked?: boolean
  customIcon?: {
    Checked: LucideIcon
    Unchecked: LucideIcon
  }
}

const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Thumb>,
  SwitchThumbProps
>(({ className, variant, size, checked, customIcon, ...props }, ref) => (
  <SwitchPrimitives.Thumb
    className={switchThumbVariants({ className, variant, size })}
    ref={ref}
    {...props}
  >
    {variant === 'custom' && customIcon && (
      checked ? (
        <customIcon.Checked className="w-fit h-fit" strokeWidth={2.5} />
      ) : (
        <customIcon.Unchecked className="w-fit h-fit" strokeWidth={2.5} />
      )
    )}
  </SwitchPrimitives.Thumb>
))

export { Switch, SwitchThumb }
