// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { BalanceSummary, BalanceSummarySkeleton } from "@/components/shared/budget/BalanceSummary"
import SummaryFilter from "./filter"

// hooks
import { useSummarizedBalance } from "@/lib/react-query/queries"

const Summary = () => {
  const { data: balance, isLoading: isBalanceLoading } = useSummarizedBalance('HUF')

  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2 className="border-green-600 dark:border-green-400 indent-border">
          <span className="text-green-600 dark:text-green-400 overline">Summary</span> of Budgets
        </h2>
      </div>

      <div className="px-4 py-5 bg-primary/40 rounded-[2rem] shadow-border/15 shadow-lg drop-shadow-md">
        <SummaryFilter />

        <Separator className="w-4/5 h-0.5 mx-auto my-4 rounded-full" />

        {!isBalanceLoading && balance ? (
          <BalanceSummary balance={balance}
            balanceBadgeProps={{
              className: 'w-full px-5 py-2 max-w-56 min-w-32',
              size: 'default',
              customLabel: 'Total Balance'
            }}
            borrowmentsBadgeProps={{
              className: 'max-w-72 py-1.5',
              size: 'sm',
              valueProps: { className: 'text-sm font-medium' }
            }}
          />
        ) : <BalanceSummarySkeleton />}
      </div>
    </>
  )
}

export default Summary
