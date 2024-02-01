// icons
import { BookMinus, BookPlus } from "lucide-react"

// types
import Budget, { BudgetType } from "@/models/Budget"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// components
import { Badge, BadgeProps } from "@/components/ui/badge"

type BudgetTypeBadeProps = {
  budget: Budget
  size: BadgeProps['size']
}

const BudgetTypeBadge = ({ budget, size }: BudgetTypeBadeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="outline"
            size={size}
            className={`
              bg-background/95 border-2 border-primary hover:bg-background/85
              ${budget.type === BudgetType.INCOME
                ? 'text-green-700/95 dark:text-green-500/95'
                : 'text-rose-600/95'
              }
            `}
          >
            {budget.type === BudgetType.INCOME ? (
              <BookPlus size={20} strokeWidth={2.5} />
            ) : (
              <BookMinus size={20} strokeWidth={2.5} />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary/95">
          <p className="font-semibold tracking-wider capitalize small-caps">
            {budget.type}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BudgetTypeBadge
