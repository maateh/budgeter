import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote, QueryOptions } from "@/services/api/types"

const useNotesPagination = ({ params, filter, sortBy }: QueryOptions<BudgetNote>) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['notes', filterBy, excludeBy, sortBy],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budgetNote.get({
        params: { ...params, limit: params?.limit || 20, offset },
        filter, sortBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useNotesPagination
