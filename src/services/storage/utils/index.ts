// types
import { Pagination, PaginationParams } from "@/services/api/types"

/**
 * Paginates the given data based on the provided offset and limit.
 * @param data - The array of data to paginate.
 * @param offset - The starting index of the pagination.
 * @param limit - The maximum number of items per page.
 * @returns An object containing paginated data and metadata.
 */
export function paginate<D>(data: D[], params?: PaginationParams, sortBy?: (a: D, b: D) => number): Pagination<D> {
  const { offset = 0, limit = -1 } = params || {}

  const nextPageOffset = limit > -1
    ? offset + limit < data.length ? offset + limit : null
    : null

  const sortedData = data.sort(sortBy)

  return {
    offset,
    limit,
    nextPageOffset,
    total: data.length,
    data: limit > -1 ? sortedData.slice(offset, offset + limit) : sortedData
  }
}

/**
 * Filters an array of documents based on the provided filter object.
 * @param documents - The array of documents to filter.
 * @param filterBy - The partial object used as a filter criteria.
 * @returns An array of documents that match the filter criteria.
 */
export function filter<D>(documents: D[], filterBy?: Partial<D>): D[] {
  if (!filterBy) return documents

  return documents.filter((entry: D) => Object.entries(filterBy)
    .every(([key, value]) => {
      if (value === undefined) return true
      return value === entry[key as keyof D]
    })
  )
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
