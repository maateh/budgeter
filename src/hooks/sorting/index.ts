// hooks
import { useSearch } from "@/hooks"

// types
import { SearchSort, SortHookReturn } from "@/hooks/sorting/types"

// utils
import { handleOrderToggle } from "@/hooks/sorting/utils"

/**
 * Manages sorting parameters in the URL search string.
 * 
 * @param {SearchSort} [defaultSort] - The default sorting criteria.
 * @returns {SortHookReturn} An object containing functions to manage sorting.
 */
function useSorting(defaultSort?: SearchSort): SortHookReturn {
  const { getParam, setParam } = useSearch<'sortBy', SearchSort>()

  /**
   * Toggles the sorting order for the specified entry key.
   * 
   * @param {string} entryKey - The key of the entry to toggle sorting for.
   * @param {'1' | '-1'} [fixedOrder] - A fixed sorting order.
   */
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
