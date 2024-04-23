// types
import { Filter, FilterOptions, RangeFilter, Sort, Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"
import { FilterSearchParams, SearchFilter } from "@/hooks/filter/types"
import { SearchSort } from "@/hooks/sorting/types"

function convertSearchToFilter(searchFilter?: FilterSearchParams<TransactionSearchParams>): FilterOptions<Transaction> | undefined {
  if (!searchFilter) return undefined

  const convertFilter = (filterEntries?: SearchFilter<TransactionSearchParams>): Filter<Transaction> | undefined => {
    if (!filterEntries) return undefined

    return {
      ...filterEntries,
      processed:
        filterEntries.processed === 'true' ? true :
        filterEntries.processed === 'false' ? false : undefined
    } as Filter<Transaction>
  }

  const convertRange = (filterEntries?: SearchFilter<TransactionSearchParams>): RangeFilter | undefined => {
    if (!filterEntries) return undefined

    return {
      updatedAt: {
        min: filterEntries.dateFrom
          ? new Date(parseInt(filterEntries.dateFrom as string)).getTime()
          : undefined,
        max: filterEntries.dateTo
          ? new Date(parseInt(filterEntries.dateTo as string)).getTime()
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
    filterBy: convertFilter(searchFilter.filterBy),
    excludeBy: convertFilter(searchFilter.excludeBy),
    rangeBy: convertRange(searchFilter.rangeBy)
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
