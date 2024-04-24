// types
import { Range, RangeFilter, RangeFilterEntryValue } from "@/services/api/types"

// utils
import { getNestedValue } from "@/services/storage/utils"

/**
 * Filters an array of documents based on the provided ranges for specified keys.
 * 
 * @template T - The type of documents being filtered.
 * @param {T[]} documents - The array of documents to filter.
 * @param {RangeFilter} ranges - An object containing ranges for specified keys.
 * @returns {T[]} An array of documents that fall within the specified ranges.
 */
function rangeFilter<T>(documents: T[], ranges?: RangeFilter): T[] {
  if (!ranges) return documents

  return documents.filter((document) => {
    /** Iterate through each key-reference pair in the ranges object. */
    return Object.entries(ranges)
      .reduce((inRange, [keyRef, range]) => {
        /**
         * Extract the entry value corresponding to the 
         * key reference from the document.
         */
        const entryValue = getNestedValue<T>(document, keyRef)

        /** Check if the extracted value falls within the specified range. */
        return inRange && isInRange(entryValue, range)
      }, true)
  })
}

/**
 * Checks if a given value falls within the specified range.
 * 
 * @param {RangeFilterEntryValue} value - The value to check.
 * @param {Range} range - The range to compare against.
 * @returns {boolean} True if the value falls within the range, otherwise false.
 */
function isInRange(value: RangeFilterEntryValue, range?: Range): boolean {
  if (!value || !range) return true

  /**
   * If the value is a string and can be parsed as a date,
   * convert it to a timestamp value.
  */
  if (typeof value === 'string') {
    if (isNaN(Date.parse(value as string))) return true
    value = new Date(value).getTime()
  }

  /** Checks if the value is within the specified range. */
  if (range.min !== undefined && value < range.min) return false
  if (range.max !== undefined && value > range.max) return false

  return true
}

export default rangeFilter
