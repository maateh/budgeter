// components
import { BalanceSummary, BalanceSummarySkeleton } from "@/components/shared/budget/BalanceSummary"

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

      {/* TODO: option to multiply balance by a given currency */}
      {/* TODO: option to filter summary by a given currency */}

      {!isBalanceLoading && balance ? (
        <BalanceSummary balance={balance} />
      ) : (
        <BalanceSummarySkeleton />
      )}
    </>
  )
}

export default Summary
