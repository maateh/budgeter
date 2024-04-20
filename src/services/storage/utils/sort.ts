// types
import { Sort } from "@/services/api/types"

// utils
import { getNestedValue } from "@/services/storage/utils"

/**
 * Sorts an array of documents based on the provided sorting criteria.
 * 
 * @template T - The type of the documents being sorted.
 * @param {T[]} documents - The array of documents to sort.
 * @param {Sort} sortBy - An object containing the sorting criteria.
 * @returns {T[]} The sorted array of documents.
 */
function sort<T>(documents: T[], sortBy: Sort): T[] {
  return documents.sort((a, b) => {
    for (const keyRef in sortBy) {
      const order = sortBy[keyRef]

      /** Get the (potentially nested) values to compare. */
      const valueA = getNestedValue<T>(a, keyRef)
      const valueB = getNestedValue<T>(b, keyRef)

      const comparison = compareValues(valueA, valueB)
      if (comparison !== 0) {
        return order === 1 ? comparison : -comparison
      }
    }

    /** If sortBy isn't provided, everything will be sorted by default. */
    return 0
  })
}

/**
 * Compares two values for sorting.
 * 
 * @template T - The type of the values being compared.
 * @param {(T | undefined)} a - The first value to compare.
 * @param {(T | undefined)} b - The second value to compare.
 * @returns {number} A negative number if a should come before b, a positive number if b should come before a, or 0 if they are equal.
 */
function compareValues<V>(a: V | undefined, b: V | undefined): number {
  /** Default comparisons if one of the values is undefined */
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1

  /** Compare strings (or dates) */
  if (typeof a === 'string' && typeof b === 'string') {
    /** If both values are dates we will compare based on timestamps. */
    if (!isNaN(Date.parse(a)) && !isNaN(Date.parse(b))) {
      return new Date(a).getTime() - new Date(b).getTime()
    }

    return a.localeCompare(b)
  }

  /** Compare numbers */
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return 0
}

export default sort
