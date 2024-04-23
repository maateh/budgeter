// hooks
import { useSearch } from "@/hooks"

// types
import { SearchSort, SortHookReturn } from "@/hooks/sorting/types"

// utils
import { handleOrderToggle } from "@/hooks/sorting/utils"

function useSorting(defaultSort?: SearchSort): SortHookReturn {
  const { getParam, setParam } = useSearch<'sortBy', SearchSort>()

  const toggleSort = (entryKey: string, fixedOrder?: '1' | '-1') => {
    const sortBy = getParam('sortBy')
    const order = sortBy[entryKey]
    
    const paramEntry = handleOrderToggle(entryKey, fixedOrder || order, !!fixedOrder)
    setParam('sortBy', paramEntry || defaultSort)
  }

  const sortBy = getParam('sortBy')

  return {
    sortBy: Object.keys(sortBy).length ? sortBy : undefined,
    toggleSort
  }
}

export default useSorting
