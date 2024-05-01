import { forwardRef } from "react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// components
import BudgetMarker from "@/components/shared/budget/custom/BudgetMarker"

// types
import { Budget } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type BudgetNameBadgeProps = {
  budget: Pick<Budget, 'id' | 'name' | 'theme'>
} & BadgeProps

const BudgetNameBadge = forwardRef<HTMLDivElement, BudgetNameBadgeProps>(({
  budget, className, ...props
}, ref) => (
  <Badge className={cn("bg-background/35 w-fit border-2 border-border/60 icon-wrapper hover:bg-background/25", className)}
    ref={ref}
    {...props}
  >
    <BudgetMarker className="size-4" budget={budget} />
    <p className="text-center font-heading capitalize break-words">{budget.name}</p>
  </Badge>
)) 

export default BudgetNameBadge
