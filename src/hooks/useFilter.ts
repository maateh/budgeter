import { useSearchParams } from "react-router-dom"

// types
import { Filter, FilterOptions } from "@/services/api/types"

type FilterType = 'filterBy' | 'excludeBy'

type FilterRecord<T> = Record<keyof T, string>

type FilterHookReturn<T> = FilterOptions<T> & {
  setParam: (item: FilterRecord<T>, type: FilterType) => void
  removeParam: (key: keyof T, type: FilterType) => void
}

const KEY_SPLITTER = '@'
const VALUE_SEPARATOR = ':'

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

function useFilter<T>(): FilterHookReturn<T> {
  const [params, setParams] = useSearchParams()
  
  const setParam = (record: FilterRecord<T>, type: FilterType) => {
    setParams((params) => {
      const filter = { ...getFilter<T>(params, type), ...record }
      const param = convertToParam(filter)

      params.set(type, param)
      return params
    })
  }

  const removeParam = (key: keyof T, type: FilterType) => {
    setParams((params) => {
      const filter = getFilter<T>(params, type)
      delete filter[key]

      const param = convertToParam(filter)
      
      params.set(type, param)
      return params
    })
  }

  return {
    filterBy: getFilter(params, 'filterBy'),
    excludeBy: getFilter(params, 'excludeBy'),
    setParam, removeParam
  }
}

export default useFilter
