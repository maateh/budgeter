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
  budget: Budget
} & BadgeProps

const BudgetNameBadge = forwardRef<HTMLDivElement, BudgetNameBadgeProps>(({
  budget, className, ...props
}, ref) => (
  <Badge className={cn("w-fit border-2 icon-wrapper", className)}
    style={{ borderColor: budget.theme.foreground }}
    ref={ref}
    {...props}
  >
    <BudgetMarker className="size-4" budget={budget} />
    <p className="text-center font-heading capitalize break-words">{budget.name}</p>
  </Badge>
)) 

export default BudgetNameBadge
