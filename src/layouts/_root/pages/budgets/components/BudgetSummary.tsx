// icons
import { ArrowUpToLine, Wallet } from 'lucide-react'

// shadcn
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// components
import BudgetMarker from '@/components/shared/budget/BudgetMarker'
import BudgetTypeBadge from '@/components/shared/budget/BudgetTypeBadge'
import InfoBadge from '@/components/ui/custom/InfoBadge'
import BudgetActions from './BudgetActions'

// types
import { Budget } from '@/services/api/types'

// utils
import { formatWithCurrency } from '@/utils'

type BudgetSummaryProps = {
  budget: Budget
}

const BudgetSummary = ({ budget }: BudgetSummaryProps) => {
  return (
    <div className="flex flex-col gap-y-3.5 mx-2 sm:mx-3.5">
      <div className="flex flex-wrap justify-between gap-x-2 gap-y-5">
        <Badge className="py-3.5 border-2 icon-wrapper"
          size="lg"
          style={{ borderColor: budget.theme.foreground }}
        >
          <BudgetMarker className="size-4" budget={budget} />
          <h2 className="text-xl text-center sm:text-2xl">
            {budget.name}
          </h2>            
        </Badge>

        <BudgetActions budget={budget} />
      </div>

      <Separator className="w-11/12 mx-auto my-1.5" />

      <div className="flex flex-wrap justify-around gap-x-6 gap-y-4 small-caps">
        <InfoBadge className={`flex-1 max-w-72 min-w-40
            ${budget.balance.current > 0
              ? 'bg-green-700/10 hover:bg-green-700/15 text-green-700 border-green-700 dark:text-green-400 dark:border-green-400'
              : 'text-destructive border-destructive'}
          `}
          size="lg"
          label="Current Balance"
          value={formatWithCurrency(budget.balance.current, budget.balance.currency)}
          icon={<Wallet strokeWidth={2.25} />}
        />

        <InfoBadge className="flex-1 max-w-72 min-w-40"
          label="Ceiling"
          value={formatWithCurrency(budget.balance.ceiling, budget.balance.currency)}
          icon={<ArrowUpToLine strokeWidth={2.25} />}
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <InfoBadge className="text-accent border-accent bg-background/65"
          separatorProps={{ className: 'h-4' }}
          size="sm"
          orientation="vertical"
          label="Income"
          value={formatWithCurrency(budget.balance.income, budget.balance.currency)}
        />
        <InfoBadge className="text-destructive border-destructive bg-background/65"
          separatorProps={{ className: 'h-4' }}
          size="sm"
          orientation="vertical"
          label="Loss"
          value={formatWithCurrency(budget.balance.loss, budget.balance.currency)}
        />
      </div>

      <Separator className="w-11/12 mx-auto my-1.5" />

      {/* TODO: this still needs to be redesigned */}
      <div className="flex items-center justify-between gap-x-4">
        <BudgetTypeBadge budget={budget} />
        <Progress className="h-5"
          value={budget.balance.current}
          maxValue={budget.balance.ceiling}
          variant={budget.balance.current > 0 ? budget.type : 'negative'}
        />
      </div>
    </div>
  )
}

export default BudgetSummary
