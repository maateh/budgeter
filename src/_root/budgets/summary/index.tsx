// shadcn
import { Separator } from '@/components/ui/separator'

// components
import BalanceBadge from '@/components/shared/budget/custom/BalanceBadge'
import BudgetNameBadge from '@/components/shared/budget/custom/BudgetNameBadge'
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
    <div className="flex flex-col gap-y-3.5">
      <div className="flex flex-wrap justify-between gap-x-2 gap-y-5">
        <BudgetNameBadge className="py-3.5 text-xl sm:text-2xl"
          size="lg"
          budget={budget}
        />

        <BudgetActions budget={budget} />
      </div>

      <Separator className="w-11/12 mx-auto my-1.5" />

      <div className="flex flex-wrap justify-around gap-x-6 gap-y-4 small-caps">
        <BalanceBadge className="flex-1 max-w-72 min-w-40"
          size="lg"
          balance={budget.balance}
          showLabel
        />

        {/* TODO: instead of ceiling might be better to show something else
          e.g. costs this month, expected balance based on unprocessed transactions */}
        {/* <InfoBadge className="flex-1 max-w-72 min-w-40"
          label="Ceiling"
          value={formatWithCurrency(budget.balance.ceiling, budget.balance.currency)}
          icon={<ArrowUpToLine strokeWidth={2.25} />}
        /> */}
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
    </div>
  )
}

export default BudgetSummary
