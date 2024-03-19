import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote, PaginationParams } from "@/services/api/types"

type PaginatedNotesByStatusQueryOptions = {
  params?: PaginationParams
}

const usePaginatedNotesByStatus = (budgetId: string, status: BudgetNote['status'], { params }: PaginatedNotesByStatusQueryOptions = {}) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['paginatedNotesByStatus', budgetId, status],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budgetNote.getPaginated({
        limit: params?.limit || 5,
        offset
      }, { budgetId, status })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedNotesByStatus
