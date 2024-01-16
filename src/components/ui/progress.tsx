"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground hover:bg-primary-foreground/85",
        income:
          "bg-green-600 dark:bg-green-600 hover:bg-green-600/85 dark:hover:bg-green-500/85",
        expense:
          "bg-red-600 dark:bg-red-600 hover:bg-red-600/85 dark:hover:bg-red-500/85",
      },
    },
    defaultVariants: {
      variant: "default",
    },
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
      className="h-full w-full flex-1 bg-neutral-400 transition-all"
      style={{ transform: `translateX(${(value || 0) / (maxValue || 100) * 100}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
