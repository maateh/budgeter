// types
import { Filter, FilterOptions, Pagination, PaginationParams } from "@/services/api/types"

/**
 * Paginates the given data based on the provided offset and limit.
 * @param data - The array of data to paginate.
 * @param offset - The starting index of the pagination.
 * @param limit - The maximum number of items per page.
 * @returns An object containing paginated data and metadata.
 */
export function paginate<D>(data: D[], params?: PaginationParams, sortBy?: (a: D, b: D) => number): Pagination<D> {
  const { offset = 0, limit = -1, maxItemLimit } = params || {}

  /**
   * If 'maxItemLimit' is specified we have to override the current
   * offset limit if 'maxItemLimit' is less than the actual, so as
   * not to exceed the maximum amount of items.
   */
  const currentOffsetLimit = maxItemLimit ? Math.min(offset + limit, maxItemLimit) : offset + limit

  /**
   * Determines the next page offset based on the current offset
   * and limit, considering the maximum item limit if specified.
   */
  const fixedLength = maxItemLimit ? Math.min(data.length, maxItemLimit) : data.length
  const nextPageOffset = limit > -1
    ? currentOffsetLimit < fixedLength ? currentOffsetLimit : null
    : null

  const sortedData = data.sort(sortBy)

  return {
    offset,
    limit,
    maxItemLimit: maxItemLimit || data.length,
    nextPageOffset,
    total: data.length,
    data: limit > -1 ? sortedData.slice(offset, currentOffsetLimit) : sortedData
  }
}

/**
 * Filters an array of documents based on the provided filter and exclusion criteria.
 * @param documents - The array of documents to filter.
 * @param filter - An object containing filter and exclusion criteria.
 * @param filter.filterBy - The partial object used as filter criteria.
 * @param filter.excludeBy - The partial object used as exclusion criteria.
 * @returns An array of documents that match the filter criteria and are not excluded.
 * 
 * Filtering criteria can include arrays of values for each property to match against.
 */
export function filter<D>(documents: D[], filter?: FilterOptions<D>): D[] {
  const { filterBy, excludeBy } = filter || {}
  if (!filterBy && !excludeBy) return documents

  return documents.filter((entry: D) => {
    const shouldInclude = (criteria?: Filter<D>, inclusion?: boolean) => {
      return !criteria || Object.entries(criteria).every(([key, value]) => {
        // If the filter value is not defined, it is ignored
        if (value === undefined) return true

        /**
         * If the filter value is an array, check if the entry value matches
         * any value in the array. (Otherwise, perform a strict equality check.)
         * 
         * In both cases inclusion is checked (filter or exclude).
         */
        const entryValue = entry[key as keyof D]
        return Array.isArray(value)
          ? value.includes(entryValue) === inclusion
          : value === entryValue === inclusion
      })
    }

    return shouldInclude(filterBy, true) && shouldInclude(excludeBy, false)
  })
}

/**
 * Filters an object of documents based on the provided filter function.
 * @param documents - The object of documents to filter.
 * @param filter - The function used as a filter criteria.
 * @returns An object of documents that match the filter criteria.
 */
export function filterObject<D extends { id: string }>(documents: Record<string, D>, filter: (doc: D) => boolean): Record<string, D> {
  return Object.values(documents)
    .filter(filter)
    .reduce((docs, doc) => ({
      ...docs,
      [doc.id]: doc
    }), {} as Record<string, D>)
}
