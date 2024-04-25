import { keepPreviousData, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// hooks
import { useDebounce } from "@/hooks"

// types
import { QueryOptions, Transaction } from "@/services/api/types"

const useTransactionsControlledPagination = ({ params, filter, sortBy }: QueryOptions<Transaction> = {}) => {
  const { api } = useAPI()
  
  const { rangeBy } = filter || {}
  let { filterBy, excludeBy } = filter || {}

  const { debouncedValue: debouncedName } = useDebounce({
    value: (filterBy?.name || excludeBy?.name) as string | undefined
  })

  filterBy = { ...filterBy, name: filterBy?.name ? debouncedName : undefined}
  excludeBy = { ...excludeBy, name: excludeBy?.name ? debouncedName : undefined}

  return useQuery({
    queryKey: ['transactions', 'controlled', filterBy, excludeBy, rangeBy, sortBy, params],
    queryFn: async () => await api.transaction.getWithBudget({ params, filter, sortBy }),
    placeholderData: keepPreviousData
  })
}

export default useTransactionsControlledPagination
