import { useParams } from 'react-router-dom'

// icons
import { AlertTriangle, BadgeInfo, Minus, Plus } from 'lucide-react'

// shadcn
import { BadgeTooltip } from '@/components/ui/badge'
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

      <div className="flex flex-col items-center gap-5 small-caps">
        <BalanceBadge className="w-full px-8 py-3 max-w-72 min-w-48"
          size="lg"
          iconSize={22}
          balance={budget.balance}
          showLabel
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <InfoBadge className="text-accent border-accent bg-background/65"
          separatorProps={{ className: "h-4" }}
          size="sm"
          orientation="vertical"
          label="Income"
          value={formatWithCurrency(budget.balance.income, budget.balance.currency)}
        />

        <InfoBadge className="text-destructive border-destructive bg-background/65"
          separatorProps={{ className: "h-4" }}
          size="sm"
          orientation="vertical"
          label="Loss"
          value={formatWithCurrency(budget.balance.loss, budget.balance.currency)}
        />
      </div>

      <div className="space-y-2.5">
        <h3 className="mt-3.5 mx-auto px-3.5 indent-border">
          Money <span className="text-muted-foreground/65 overline">Under Borrowment</span>
        </h3>

        <div className="mx-2.5 flex flex-wrap justify-around items-center gap-y-2 gap-x-4 font-semibold sm:gap-x-12">
          <div className="flex-1 flex justify-center gap-x-1.5">
            <BadgeTooltip className="cursor-pointer"
              tooltipProps={{ className: "max-w-sm", asChild: true }}
              variant="ghost"
              size="icon"
              tooltip={(
                <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
                  valueProps={{ className: "text-xs font-normal tracking-wider break-words" }}
                  variant="accent"
                  value="This amount of money is the loans that you have borrowed from someone and are currently increasing your balance. (You might have to pay it back.)"
                  icon={<AlertTriangle className="text-accent" size={20} />}
                />
              )}
            >
              <BadgeInfo className="text-muted-foreground" size={20} />
            </BadgeTooltip>

            <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
              separatorProps={{ className: "h-5" }}
              orientation="vertical"
              size="sm"
              variant="accent"
              label="Borrowments"
              value={formatWithCurrency(budget.balance.borrowment.plus, budget.balance.currency)}
              icon={<Plus className="text-accent" size={20} strokeWidth={5} />}
            />
          </div>

          <div className="flex-1 flex justify-center gap-x-1.5">
            <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
              separatorProps={{ className: "h-5" }}
              orientation="vertical"
              size="sm"
              variant="destructive"
              label="Borrowments"
              value={formatWithCurrency(budget.balance.borrowment.minus, budget.balance.currency)}
              icon={<Minus className="text-destructive" size={20} strokeWidth={5} />}
            />

            <BadgeTooltip className="cursor-pointer"
              tooltipProps={{ className: "max-w-sm", asChild: true }}
              variant="ghost"
              size="icon"
              tooltip={(
                <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
                  valueProps={{ className: "text-xs font-normal tracking-wider break-words" }}
                  variant="destructive"
                  value="This amount of money is the loans that you have lent to someone and are currently reducing your balance. (This will likely be refunded.)"
                  icon={<AlertTriangle className="text-destructive" size={20} />}
                />
              )}
            >
              <BadgeInfo className="text-muted-foreground" size={20} />
            </BadgeTooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetSummary
