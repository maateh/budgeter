import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote, QueryOptions } from "@/services/api/types"

const useNotesPagination = ({ params, filterBy }: QueryOptions<BudgetNote>) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['notes', filterBy],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budgetNote.get({
        params: { limit: params?.limit || 5, offset },
        filterBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useNotesPagination
