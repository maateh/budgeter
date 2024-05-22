/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipContentProps, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full whitespace-nowrap font-medium font-heading ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary shadow-border/35 dark:shadow-border/15 hover:bg-primary-foreground/85",
        destructive: "font-semibold bg-destructive text-destructive-foreground/90 shadow-destructive/35 dark:shadow-destructive/20 hover:bg-destructive/90",
        outline: "text-foreground border shadow-border/20 dark:shadow-border/5 hover:bg-primary-foreground/5 hover:text-foreground/90",
        secondary: "bg-secondary text-secondary-foreground shadow-border/35 dark:shadow-border/20 hover:bg-secondary/80",
        ghost: "hover:bg-primary/40",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "border-2 text-foreground/90 hover:bg-foreground/5"
      },
      size: {
        default: "h-9 px-3 py-3 text-sm tracking-wide shadow-md sm:h-10 sm:px-4 sm:text-base",
        xs: "w-fit h-fit px-2 py-1 text-xs",
        sm: "h-8 px-2.5 text-sm shadow-sm sm:h-9 sm:px-3",
        lg: "h-10 px-3.5 text-base tracking-wide shadow-md sm:h-11 sm:px-4 sm:text-lg",
        xl: "h-11 px-4 text-base tracking-wide shadow-lg sm:h-12 sm:px-5 sm:text-lg",
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
