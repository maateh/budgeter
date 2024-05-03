import { useParams } from 'react-router-dom'

// icons
import { HandCoins } from 'lucide-react'

// shadcn
import { Separator } from '@/components/ui/separator'

// components
import BalanceBadge from '@/components/shared/budget/ui/BalanceBadge'
import BudgetNameBadge from '@/components/shared/budget/ui/BudgetNameBadge'
import InfoBadge from '@/components/ui/custom/InfoBadge'
import BudgetActions from './BudgetActions'
import BudgetSummarySkeleton from './skeleton'

// hooks
import { useBudget } from '@/lib/react-query/queries'

// utils
import { formatWithCurrency } from '@/utils'

const BudgetSummary = () => {
  const { id } = useParams() as { id: string }

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id)

  if (isBudgetLoading || !budget) {
    return <BudgetSummarySkeleton />
  }

  return (
    <div className="flex flex-col gap-y-3.5">
      <div className="flex flex-wrap justify-between gap-x-2 gap-y-5">
        <BudgetNameBadge className="py-3.5 text-xl sm:text-2xl"
          size="lg"
          budget={budget}
        />

        <BudgetActions budget={budget} />
      </div>

      <Separator className="w-5/6 mx-auto my-1.5" />

      <div className="flex flex-wrap justify-around gap-x-6 gap-y-4 small-caps">
        <BalanceBadge className="flex-1 max-w-72 min-w-48"
          size="lg"
          balance={budget.balance}
          showLabel
        />

        <InfoBadge className="flex-1 max-w-64 min-w-48"
          label="Under Borrowment"
          value={formatWithCurrency(budget.balance.borrowment, budget.balance.currency)}
          icon={<HandCoins strokeWidth={2.25} />}
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
    </div>
  )
}

export default BudgetSummary
