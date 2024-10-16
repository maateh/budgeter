import { useSearchParams } from "react-router-dom"

// hooks
import { useSearch } from "@/hooks"

// types
import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { FilterHookOptions, FilterHookReturn, SearchFilter } from "@/hooks/filter/types"
import { FilterKeys } from "@/services/api/types"

// utils
import { getCurrentPage } from "@/hooks/filter/utils"

/**
 * A custom hook for managing pagination and filtering parameters in URL search params.
 * It allows setting pagination parameters like page size and current page index, as well as
 * setting and removing filter parameters.
 * 
 * @template T - The type of data being filtered.
 * @param {FilterHookOptions} options - Optional configuration options for the filter hook.
 * @returns {FilterHookReturn<T>} An object containing pagination and filtering methods and parameters.
 */
function useFilter<T extends object>({ pageSize = 10 }: FilterHookOptions = {}): FilterHookReturn<T> {
  const [searchParams, setSearchParams] = useSearchParams()

  const { getParam, convertToSearchParam } = useSearch<FilterKeys | 'page', SearchFilter<T>>()
  
  /**
   * Sets the pagination parameters in the URL search params based on the provided updater function.
   * 
   * @param {OnChangeFn<PaginationState>} updater - The function that updates the pagination state.
   */
  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    setSearchParams((searchParams) => {
      if (typeof updater !== 'function') return searchParams

      const { pageIndex } = updater({
        pageSize,
        pageIndex: getCurrentPage(searchParams)
      })

      searchParams.set('page', pageIndex.toString())
      return searchParams
    }, { replace: true })
  }

  /**
   * Sets a filter parameter in the URL search params
   * based on the provided filter entry and type.
   * 
   * @param {FilterKeys} filterKey - The key of the filter parameter to set ('filterBy', 'excludeBy' or 'rangeBy').
   * @param {SearchFilter<T>} entry - The filter entry containing filter values to set.
   */
  const setFilterEntry = (filterKey: FilterKeys, entry: SearchFilter<T>) => {
    setSearchParams((searchParams) => {
      const filter = getParam(filterKey)
      const param = convertToSearchParam({ ...filter, ...entry })

      searchParams.set(filterKey, param)
      searchParams.set('page', '1')

      /**
       * Filter type needs to be deleted if the param is
       * falsy because no more entries are specified on
       * the actual filter type.
       */
      if (!param) searchParams.delete(filterKey)
      return searchParams
    }, { replace: true })
  }

  /**
   * Removes a filter parameter from the URL search
   * params based on the provided key and filter type.
   * 
   * @param {FilterKeys} filterKey - The key of the filter parameter to remove ('filterBy', 'excludeBy' or 'rangeBy').
   * @param {keyof T} entryKeys - The key of the filter entry to remove.
   */
  const removeFilterEntries = (filterKey: FilterKeys, entryKeys: (keyof T)[]) => {
    setSearchParams((searchParams) => {
      const filter = getParam(filterKey)
      entryKeys.forEach((entryKey) => delete filter[entryKey])

      const param = convertToSearchParam(filter)
      searchParams.set(filterKey, param)
      searchParams.set('page', '1')

      if (!param) searchParams.delete(filterKey)
      return searchParams
    }, { replace: true })
  }

  /**
   * Toggles a filter entry between 'filterBy' and 'excludeBy'
   * in the URL search params based on the provided key.
   * 
   * @param {FilterKeys} filterKey - The key of the filter parameter to toggle ('filterBy' or 'excludeBy').
   * @param {keyof T} entryKey - The key of the filter entry to toggle.
   */
  const toggleFilterType = (filterKey: FilterKeys, entryKey: keyof T) => {
    setSearchParams((searchParams) => {
      const anotherFilterKey = filterKey === 'filterBy' ? 'excludeBy' : 'filterBy'
      const anotherFilter = getParam(anotherFilterKey)
      
      const value = anotherFilter[entryKey]
      const entry = { [entryKey]: value } as unknown as SearchFilter<T>

      if (!value) return searchParams

      setFilterEntry(filterKey, entry)
      removeFilterEntries(anotherFilterKey, [entryKey])

      return searchParams
    }, { replace: true })
  }

  const pageOffsetIndex = getCurrentPage(searchParams) - 1
  const filterBy = getParam('filterBy')
  const excludeBy = getParam('excludeBy')
  const rangeBy = getParam('rangeBy')

  return {
    pagination: {
      pageSize,
      pageIndex: pageOffsetIndex,
      params: {
        limit: pageSize,
        offset: pageOffsetIndex * pageSize
      }
    },
    searchFilter: { filterBy, excludeBy, rangeBy },
    filterEntries: { ...filterBy, ...excludeBy },
    setPagination, setFilterEntry, removeFilterEntries, toggleFilterType
  }
}

export default useFilter
