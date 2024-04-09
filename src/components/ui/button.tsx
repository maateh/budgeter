/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipContentProps, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full whitespace-nowrap text-md font-medium font-heading ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary hover:bg-primary-foreground/85",
        destructive: "bg-destructive text-destructive-foreground/90 font-semibold hover:bg-destructive/90",
        outline: "text-foreground border hover:bg-primary-foreground/5 hover:text-foreground/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/15",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "border-2 text-foreground/90 hover:bg-foreground/5"
      },
      size: {
        default: "h-10 px-4 py-3 tracking-wide shadow-lg",
        sm: "h-9 px-3 text-sm shadow-md",
        lg: "h-11 px-4 text-lg tracking-wide shadow-xl",
        xl: "h-12 px-5 text-lg tracking-wide shadow-md",
        icon: "w-fit h-fit p-1.5"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export interface ButtonTooltipProps extends ButtonProps {
  tooltip: React.ReactNode
  tooltipProps?: TooltipContentProps
}

const ButtonTooltip = React.forwardRef<HTMLButtonElement, ButtonTooltipProps>(
  ({ tooltip, tooltipProps, children, ...props }, ref) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...props}>{children}</Button>
        </TooltipTrigger>
        <TooltipContent {...tooltipProps}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)

export { Button, ButtonTooltip, buttonVariants }
