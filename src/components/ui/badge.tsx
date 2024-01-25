import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border hover:bg-secondary/15 text-foreground",
        positive: "text-neutral-200 bg-green-800 hover:bg-green-700",
        negative: "text-neutral-200 bg-red-800 hover:bg-red-700",
        income:
          "text-sm border-2 border-green-700/75 dark:border-green-500/65 bg-background/80 text-green-700/95 dark:text-green-500/95 font-semibold hover:bg-secondary/10",
        loss:
          "text-sm border-2 border-red-700/75 dark:border-red-500/65 bg-background/80 text-red-700/95 dark:text-red-500/95 font-semibold hover:bg-secondary/10"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Badge, badgeVariants }
