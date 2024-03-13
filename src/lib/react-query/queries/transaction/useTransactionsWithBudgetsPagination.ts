import { UUID } from "crypto"
import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

type TransactionsWithBudgetsProps = {
  type: Transaction['type']
  processed: Transaction['processed']
  budgetId?: UUID
}

const useTransactionsWithBudgetsPagination = ({ type, processed, budgetId }: TransactionsWithBudgetsProps) => {
  const { api } = useAPI()

  const filterBy: Partial<Transaction> = budgetId
    ? { type, processed, budgetId }
    : { type, processed }

  return useInfiniteQuery({
    queryKey: ['transactionsWithBudgetsPagination', type, processed/*, budgetId || 'all'*/],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getWithBudgets({ offset, limit: 5 }, filterBy)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useTransactionsWithBudgetsPagination
