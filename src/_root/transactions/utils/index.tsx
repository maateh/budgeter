// types
import { Filter, FilterOptions, RangeFilter, Sort, Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"
import { FilterSearchParams } from "@/hooks/filter/types"
import { SearchSort } from "@/hooks/sorting/types"

function convertSearchToFilter(searchParams?: FilterSearchParams<TransactionSearchParams>): FilterOptions<Transaction> | undefined {
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

function convertSearchToSortBy(param: SearchSort): Sort {
  return Object.entries(param)
    .reduce((sortBy, [keyRef, value]) => {
      if (!value) return sortBy
      
      return {
        ...sortBy,
        [keyRef]: parseInt(value) as 1 | -1
      }
    }, {} as Sort)
}

export { convertSearchToFilter, convertSearchToSortBy }
