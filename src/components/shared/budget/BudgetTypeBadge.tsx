// icons
import { BookMinus, BookPlus } from "lucide-react"

// types
import { Budget } from "@/services/api/types"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// components
import { Badge, BadgeProps } from "@/components/ui/badge"

type BudgetTypeBadeProps = {
  budget: Budget
  size?: BadgeProps['size']
  iconSize?: number
}

// TODO: create a BudgetDetailsBadge instead of this component
const BudgetTypeBadge = ({ budget, size = 'icon-sm', iconSize = 20 }: BudgetTypeBadeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="outline"
            size={size}
            className={`
              bg-background/95 border-2 border-primary hover:bg-background/85
              ${budget.type === 'income'
                ? 'text-green-700/95 dark:text-green-500/95'
                : 'text-rose-600/95'
              }
            `}
          >
            {budget.type === 'income' ? (
              <BookPlus size={iconSize} strokeWidth={2.5} />
            ) : (
              <BookMinus size={iconSize} strokeWidth={2.5} />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent
          className={`bg-primary
            ${budget.type === 'income'
              ? 'text-green-700 dark:text-green-500'
              : 'text-rose-600 dark:text-rose-400'
            }
          `}
        >
          <p className="font-semibold tracking-wide capitalize small-caps">
            {budget.type}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BudgetTypeBadge
