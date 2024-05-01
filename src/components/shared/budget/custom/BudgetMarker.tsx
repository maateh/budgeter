import { Link } from "react-router-dom"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// types
import { Budget } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type BudgetMarkerProps = {
  budget: Pick<Budget, 'id' | 'name' | 'theme'>
  showTooltip?: boolean
  className?: string
}

const BudgetMarker = ({ budget, showTooltip, className }: BudgetMarkerProps) => {
  const link = 
    <Link to={`/budgets/${budget.id}`} onClick={(e) => e.stopPropagation()}
      className={cn("size-3.5 flex-none rounded-md border-2 border-background/35 hover:size-4 hover:opacity-95 hover:cursor-pointer", className)}
      style={{ backgroundColor: budget.theme }}
    />

  return !showTooltip ? link : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {link}
        </TooltipTrigger>
        <TooltipContent className="font-heading font-medium tracking-wide">
          Jump to "{budget.name}" details
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BudgetMarker
