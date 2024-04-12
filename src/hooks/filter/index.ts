import { useSearchParams } from "react-router-dom"

// types
import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { FilterHookOptions, FilterHookReturn, FilterRecord, FilterType } from "@/hooks/filter/types"

// utils
import { convertFilterToParam, getCurrentPage, getFilter } from "@/hooks/filter/utils"

function useFilter<T>({ pageSize = 10 }: FilterHookOptions = {}): FilterHookReturn<T> {
  const [params, setParams] = useSearchParams()
  
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

  const setFilterParam = (record: FilterRecord<T>, type: FilterType) => {
    setParams((params) => {
      const filter = { ...getFilter<T>(params, type), ...record }
      const param = convertFilterToParam(filter)

      params.set(type, param)
      return params
    })
  }

  const removeFilterParam = (key: keyof T, type: FilterType) => {
    setParams((params) => {
      const filter = getFilter<T>(params, type)
      delete filter[key]

      const param = convertFilterToParam(filter)
      
      params.set(type, param)
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
