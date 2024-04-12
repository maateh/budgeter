// constants
import { KEY_SPLITTER, VALUE_SEPARATOR } from "@/hooks/filter/constants"

// types
import { Filter, FilterOptions } from "@/services/api/types"

function getCurrentPage(params: URLSearchParams): number {
  return parseInt(params.get('page') || '1')
}

function convertFilterToParam<T>(filter: Filter<T>): string {
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

export { getCurrentPage, convertFilterToParam, getFilter }
