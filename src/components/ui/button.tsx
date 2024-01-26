import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-md font-medium font-heading ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary hover:bg-primary-foreground/85",
        destructive:
          "bg-destructive text-destructive-foreground/75 font-semibold hover:bg-destructive/90",
        outline:
          "border-2 border-border bg-secondary hover:bg-secondary/85 hover:text-foreground underline",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "border-2 border-border bg-secondary text-foreground hover:bg-secondary/90"
      },
      size: {
        default: "h-10 px-4 py-3 tracking-wide shadow-lg",
        sm: "h-9 px-3 text-sm shadow-md",
        lg: "h-11 px-4 text-lg font-medium tracking-wide shadow-xl",
        xl: "h-12 px-5 text-lg font-medium tracking-wide shadow-md",
        icon: "p-1.5",
        "icon-sm": "w-8 h-8 p-1",
        "icon-md": "w-10 h-10 p-1",
        "icon-lg": "w-12 h-12 p-2",
        "icon-xl": "w-14 h-14 p-2.5",
      },
      border: {
        default: "rounded-full",
        sm: "border-sm",
        md: "border-md",
        lg: "border-lg",
        icon: "rounded-lg"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, border, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, border, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
