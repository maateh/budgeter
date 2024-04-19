// types
import { Filter, FilterOptions, RangeFilter, Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"
import { FilterSearchParams } from "@/hooks/filter/types"

export function convertTransactionSearchToFilter(searchParams?: FilterSearchParams<TransactionSearchParams>): FilterOptions<Transaction> | undefined {
  if (!searchParams) return undefined

  const convertFilter = (searchFilter?: Filter<TransactionSearchParams>): Filter<Transaction> | undefined => {
    if (!searchFilter) return undefined

    return {
      ...searchFilter,
      processed:
        searchFilter.processed === 'true' ? true :
        searchFilter.processed === 'false' ? false : undefined
    }
  }

  const convertRange = (searchFilter?: Filter<TransactionSearchParams>): RangeFilter | undefined => {
    if (!searchFilter) return undefined

    return {
      updatedAt: {
        min: searchFilter.dateFrom
          ? new Date(parseInt(searchFilter.dateFrom as string)).getTime()
          : undefined,
        max: searchFilter.dateTo
          ? new Date(parseInt(searchFilter.dateTo as string)).getTime()
          : undefined,
      },
      // TODO: add input for payments
      // ['payment.amount']: {
      //   min: searchFilter.paymentFrom as number,
      //   max: searchFilter.paymentTo as number
      // }
    }
  }

  return {
    filterBy: convertFilter(searchParams.filterBy),
    excludeBy: convertFilter(searchParams.excludeBy),
    rangeBy: convertRange(searchParams.rangeBy)
  }
}
