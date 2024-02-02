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
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border text-foreground hover:bg-secondary/15",
        income: "border-2 border-green-700/75 bg-background/70 text-green-700/95 hover:bg-secondary/25 dark:border-green-500/65 dark:text-green-500/95",
        loss: "border-2 border-red-700/75 bg-background/70 text-red-700/95 hover:bg-secondary/25 dark:border-red-500/65 dark:text-red-500/95",
        positive: "bg-green-500/90 text-foreground border-2 border-primary/35 hover:bg-green-600/80",
        negative: "bg-red-500/90 text-foreground border-2 border-primary/35 hover:bg-red-600/80"
      },
      size: {
        xs: "px-2.5 py-0.5 text-xs font-medium",
        sm: "px-2.5 py-1 text-sm",
        md: "px-3.5 py-1 text-md font-semibold",
        lg: "px-4 py-1.5 text-lg font-semibold",
        "icon-xs": "p-1.5",
        "icon-sm": "p-2",
        "icon-md": "p-3",
        "icon-lg": "p-3.5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm"
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
