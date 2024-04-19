// constants
import { KEY_SPLITTER, VALUE_SEPARATOR } from "@/hooks/filter/constants"

// types
import { Filter, FilterKeys } from "@/services/api/types"

/**
 * Retrieves the current page index from the URL search params.
 * 
 * @param {URLSearchParams} params - The URL search params object.
 * @returns {number} The current page index.
 */
function getCurrentPage(params: URLSearchParams): number {
  return parseInt(params.get('page') || '1')
}

/**
 * Converts a filter object into a string representation suitable for URL query parameters.
 * 
 * @template T - The type of data being filtered.
 * @param {Filter<T>} filter - The filter object containing key-value pairs.
 * @returns {string} The string representation of the filter object.
 */
function convertFilterToParam<T>(filter: Filter<T>): string {
  return Object.entries(filter)
    .reduce((param, [key, value]) => {
      /** If value is falsy we don't have to set that param */
      if (!value) return param

      const item = `${key}${VALUE_SEPARATOR}${value}`
      return param.concat(item)
    }, [] as string[])
    .join(KEY_SPLITTER)
}

/**
 * Retrieves a filter object from the URL search params based on the provided filter type.
 * 
 * @template T - The type of data being filtered.
 * @param {URLSearchParams} params - The URL search params object.
 * @param {keyof FilterOptions<T>} type - The type of filter ('filterBy' or 'excludeBy').
 * @returns {Filter<T>} The filter object extracted from the URL search params.
 */
function getFilter<T>(params: URLSearchParams, type: FilterKeys): Filter<T> {
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
