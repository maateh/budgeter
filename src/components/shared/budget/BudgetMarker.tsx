import { Link } from "react-router-dom"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// types
import { Budget } from "@/services/api/types"

type BudgetMarkerProps = {
  budget: Budget
}

const BudgetMarker = ({ budget }: BudgetMarkerProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={`/budgets/${budget.id}`} onClick={(e) => e.stopPropagation()}
            className="size-3.5 rounded-md border-2 hover:size-4 hover:opacity-95 hover:cursor-pointer"
            style={{
              backgroundColor: budget.theme.background,
              borderColor: budget.theme.foreground
            }}
          />
        </TooltipTrigger>
        <TooltipContent className="font-heading font-medium tracking-wide">
          Jump to "{budget.name}" details
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BudgetMarker
