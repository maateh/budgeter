import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive/15 text-muted-foreground border border-destructive hover:bg-destructive/20",
        outline: "border text-foreground hover:bg-foreground/5",
        ghost: "text-foreground hover:bg-foreground/5",
      },
      size: {
        default: "px-5 py-1.5 text-md font-medium",
        xs: "px-2 py-0.5 text-xs font-medium",
        sm: "px-4 py-1 text-sm",
        lg: "px-6 py-2 text-lg font-semibold",
        icon: "p-1.5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Badge, badgeVariants }
