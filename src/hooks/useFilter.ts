import { useSearchParams } from "react-router-dom"

// types
import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { Filter, FilterOptions, PaginationParams } from "@/services/api/types"

type FilterType = 'filterBy' | 'excludeBy'

type FilterRecord<T> = Record<keyof T, string>

type FilterHookOptions = {
  pageSize?: number
}

type FilterHookReturn<T> = FilterOptions<T> & {
  pagination: {
    pageIndex: number
    pageSize: number
    params: PaginationParams
  }
  filterBy?: Filter<T>
  excludeBy?: Filter<T>
  setPagination: OnChangeFn<PaginationState>
  setFilterParam: (item: FilterRecord<T>, type: FilterType) => void
  removeFilterParam: (key: keyof T, type: FilterType) => void
}

const KEY_SPLITTER = '@'
const VALUE_SEPARATOR = ':'

function getCurrentPage(params: URLSearchParams): number {
  return parseInt(params.get('page') || '1')
}

function convertToParam<T>(filter: Filter<T>): string {
  return Object.entries(filter)
    .reduce((param, [key, value]) => {
      const item = `${key}${VALUE_SEPARATOR}${value}`
      return param.concat(item)
    }, [] as string[])
    .join(KEY_SPLITTER)
}

function getFilter<T>(params: URLSearchParams, type: keyof FilterOptions<T>): Filter<T> {
  const param = params.get(type)
  if (!param) return {}

  const filter: Filter<T> = param.split(KEY_SPLITTER)
    .reduce((filter, record) => {
      const [key, value] = record.split(VALUE_SEPARATOR)
      return { ...filter, [key]: value }
    }, {})

  return filter
}

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
      const param = convertToParam(filter)

      params.set(type, param)
      return params
    })
  }

  const removeFilterParam = (key: keyof T, type: FilterType) => {
    setParams((params) => {
      const filter = getFilter<T>(params, type)
      delete filter[key]

      const param = convertToParam(filter)
      
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
