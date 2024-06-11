"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "border border-border/90 relative h-4 w-full overflow-hidden rounded-full shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground/80 hover:bg-primary-foreground/75",
        accent: "bg-accent/95 hover:bg-accent/90",
        destructive: "border-destructive bg-destructive/85 hover:bg-destructive/80",
        negative: "opacity-55 border-destructive bg-destructive/55 hover:bg-destructive/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary/35",
        accent: "bg-primary/85",
        destructive: "bg-primary/85",
        negative: "bg-primary/65",
      },
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
    maxValue?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, variant, value, maxValue, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(indicatorVariants({ variant }))}
      style={{ transform: `translateX(${(value || 0) / (maxValue || 100) * 100}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
