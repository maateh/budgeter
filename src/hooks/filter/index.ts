import { useSearchParams } from "react-router-dom"

// types
import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { FilterHookOptions, FilterHookReturn, FilterRecord } from "@/hooks/filter/types"

// utils
import { convertFilterToParam, getCurrentPage, getFilter } from "@/hooks/filter/utils"
import { FilterOptions } from "@/services/api/types"

/**
 * A custom hook for managing pagination and filtering parameters in URL search params.
 * It allows setting pagination parameters like page size and current page index, as well as
 * setting and removing filter parameters.
 * 
 * @template T - The type of data being filtered.
 * @param {FilterHookOptions} options - Optional configuration options for the filter hook.
 * @returns {FilterHookReturn<T>} An object containing pagination and filtering methods and parameters.
 */
function useFilter<T>({ pageSize = 10 }: FilterHookOptions = {}): FilterHookReturn<T> {
  const [params, setParams] = useSearchParams()
  
  /**
   * Sets the pagination parameters in the URL search params based on the provided updater function.
   * 
   * @param {OnChangeFn<PaginationState>} updater - The function that updates the pagination state.
   */
  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    setParams((params) => {
      if (typeof updater !== 'function') return params

      const { pageIndex } = updater({
        pageSize,
        pageIndex: getCurrentPage(params)
      })

      params.set('page', pageIndex.toString())
      return params
    })
  }

  /**
   * Sets a filter parameter in the URL search params based on the provided filter record and type.
   * 
   * @param {FilterRecord<T>} record - The filter record containing filter values to set.
   * @param {FilterType} type - The type of filter ('filterBy' or 'excludeBy').
   */
  const setFilterParam = (record: FilterRecord<T>, type: keyof FilterOptions<T>) => {
    setParams((params) => {
      const filter = { ...getFilter<T>(params, type), ...record }
      const param = convertFilterToParam(filter)

      params.set(type, param)
      params.set('page', '1')
      
      return params
    })
  }

  /**
   * Removes a filter parameter from the URL search params based on the provided key and filter type.
   * 
   * @param {keyof T} key - The key of the filter parameter to remove.
   * @param {FilterType} type - The type of filter ('filterBy' or 'excludeBy').
   */
  const removeFilterParam = (key: keyof T, type: keyof FilterOptions<T>) => {
    setParams((params) => {
      const filter = getFilter<T>(params, type)
      delete filter[key]

      const param = convertFilterToParam(filter)
      
      params.set(type, param)
      params.set('page', '1')

      if (!param) params.delete(type)
      return params
    })
  }

  const pageOffsetIndex = getCurrentPage(params) - 1
  return {
    pagination: {
      pageSize,
      pageIndex: pageOffsetIndex,
      params: {
        limit: pageSize,
        offset: pageOffsetIndex * pageSize
      }
    },
    filterBy: getFilter(params, 'filterBy'),
    excludeBy: getFilter(params, 'excludeBy'),
    setPagination, setFilterParam, removeFilterParam
  }
}

export default useFilter
