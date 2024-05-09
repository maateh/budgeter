/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipContentProps, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const badgeVariants = cva(
  "inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-border/25 dark:shadow-border/10 hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-border/25 dark:shadow-border/10 hover:bg-secondary/80",
        accent: "bg-accent/15 text-muted-foreground border border-accent shadow-accent/35 dark:shadow-accent/20 hover:bg-accent/20",
        destructive: "bg-destructive/15 text-muted-foreground border border-destructive shadow-destructive/35 dark:shadow-destructive/20 hover:bg-destructive/20",
        outline: "border text-foreground shadow-border/20 dark:shadow-border/5 hover:bg-foreground/5",
        ghost: "text-foreground hover:bg-foreground/5",
      },
      size: {
        default: "px-5 py-1.5 text-md font-medium shadow-sm",
        xs: "px-2 py-0.5 text-xs font-medium shadow-sm",
        sm: "px-4 py-1 text-sm shadow-sm",
        lg: "px-6 py-2 text-lg font-semibold shadow-md",
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

export interface BadgeTooltipProps extends BadgeProps {
  tooltip: React.ReactNode
  tooltipProps?: TooltipContentProps
}

const BadgeTooltip = React.forwardRef<HTMLDivElement, BadgeTooltipProps>(
  ({ tooltip, tooltipProps, children, ...props }, ref) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge ref={ref} {...props}>{children}</Badge>
        </TooltipTrigger>
        <TooltipContent {...tooltipProps}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)

export { Badge, BadgeTooltip, badgeVariants }
