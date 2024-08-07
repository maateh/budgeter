// icons
import { BadgeInfo } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { BalanceSummary, BalanceSummarySkeleton } from "@/components/shared/budget/BalanceSummary"
import InfoBadge from "@/components/ui/custom/InfoBadge"
import ManageSummary from "./manage"

// hooks
import { useSummarizedBalance } from "@/lib/react-query/queries"
import { useManageSummary } from "./manage/context"

const Summary = () => {
  const { type, currency, selected } = useManageSummary()

  const {
    data: balance,
    isLoading: isBalanceLoading
  } = useSummarizedBalance(currency!, {
    id: type === 'budgets' && selected.length ? selected : undefined,
    ['balance.currency']: type === 'currencies' && selected.length ? selected : undefined
  }, { enabled: !!currency })

  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2 className="border-green-600 dark:border-green-400 indent-border">
          <span className="text-green-600 dark:text-green-400 overline">Summary</span> of Budgets
        </h2>
      </div>

      <div className="px-4 py-5 bg-primary/40 rounded-[2rem] shadow-border/10 shadow-md">
        <ManageSummary />

        <Separator className="w-4/5 h-0.5 mx-auto my-4 rounded-full" />

        {!isBalanceLoading ? balance ? (
          <BalanceSummary balance={balance}
            balanceBadgeProps={{
              className: 'w-full px-5 py-2 max-w-56 min-w-32',
              size: 'default',
              iconProps: { size: 20, strokeWidth: 2.5 },
              customLabel: 'Total Balance'
            }}
            borrowmentsBadgeProps={{
              className: 'max-w-72 py-1.5',
              valueProps: { className: 'text-sm font-medium' }
            }}
          />
        ) : (
          <InfoBadge className="w-fit mx-auto"
            separatorProps={{ className: "h-4" }}
            valueProps={{ className: "text-sm font-body font-normal break-words" }}
            orientation="vertical"
            variant="destructive"
            size="sm"
            icon={<BadgeInfo className="text-destructive" size={20} />}
            value={currency ? 'There is no budget to summarize.' : 'Please select your preferred currency.'}
          />
        ) : <BalanceSummarySkeleton />}
      </div>
    </>
  )
}

export default Summary
