// types
import { Filter, Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"

export function convertTransactionSearchToFilter(searchParams?: Filter<TransactionSearchParams>): Filter<Transaction> | undefined {
  if (!searchParams) return undefined

  return {
    ...searchParams,
    processed:
      searchParams.processed === 'true' ? true :
      searchParams.processed === 'false' ? false : undefined,
    // updatedAt: searchParams.dateFrom, // TODO: handle filter by ranges
  }
}
