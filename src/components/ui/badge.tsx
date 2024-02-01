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
        positive: "text-neutral-200 bg-green-800 hover:bg-green-700",
        negative: "text-neutral-200 bg-red-800 hover:bg-red-700",
        income:
          "border-2 border-green-700/75 bg-background/70 text-green-700/95 hover:bg-secondary/25 dark:border-green-500/65 dark:text-green-500/95",
        loss:
          "border-2 border-red-700/75 bg-background/70 text-red-700/95 hover:bg-secondary/25 dark:border-red-500/65 dark:text-red-500/95"
      },
      size: {
        default: "px-2.5 py-0.5 text-xs font-medium",
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-1.5 text-sm font-semibold",
        lg: "px-5 py-2 text-md font-semibold",
        "icon-sm": "p-2",
        "icon-md": "p-3",
        "icon-lg": "p-3.5",
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
