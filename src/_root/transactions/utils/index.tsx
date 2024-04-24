// types
import { Filter, FilterOptions, RangeFilter, Sort, Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"
import { FilterSearchParams, SearchFilter } from "@/hooks/filter/types"
import { SearchSort } from "@/hooks/sorting/types"

function convertSearchToFilter(searchFilter?: FilterSearchParams<TransactionSearchParams>): FilterOptions<Transaction> | undefined {
  if (!searchFilter) return undefined

  const convertFilter = (filterEntries?: SearchFilter<TransactionSearchParams>): Filter<Transaction> | undefined => {
    if (!filterEntries) return undefined

    const { name, budgetId, type, processed } = filterEntries
    
    return {
      name, budgetId, type,
      processed: processed === 'true'
        ? true
        : processed === 'false'
          ? false
          : undefined
    } as Filter<Transaction>
  }

  const convertRange = (filterEntries?: SearchFilter<TransactionSearchParams>): RangeFilter | undefined => {
    if (!filterEntries) return undefined

    const { dateFrom, dateTo, paymentMin, paymentMax } = filterEntries
    
    return {
      updatedAt: {
        min: dateFrom
          ? new Date(parseInt(dateFrom as string)).getTime()
          : undefined,
        max: dateTo
          ? new Date(parseInt(dateTo as string)).getTime()
          : undefined,
      },
      ['payment.amount']: {
        min: parseInt(paymentMin as string) || undefined,
        max: parseInt(paymentMax as string) || undefined
      }
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
