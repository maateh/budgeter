// types
import { Filter, FilterOptions } from "@/services/api/types"

/**
 * Filters an array of documents based on the provided filter and exclusion criteria.
 * 
 * Filtering criteria can include arrays of values for each property to match against.
 * 
 * @param {D[]} documents - The array of documents to filter.
 * @param {FilterOptions<D>} filter - An object containing filter and exclusion criteria.
 * @param {Partial<D>} filter.filterBy - The partial object used as filter criteria.
 * @param {Partial<D>} filter.excludeBy - The partial object used as exclusion criteria.
 * @param {boolean} [filter.partialMatch=false] - A flag indicating whether to perform partial matching for string values.
 * @returns {D[]} An array of documents that match the filter criteria and are not excluded.
 */
function filter<D>(documents: D[], filter?: FilterOptions<D>): D[] {
  const { filterBy, excludeBy, partialMatch = false } = filter || {}
  if (!filterBy && !excludeBy) return documents

  return documents.filter((entry: D) => {
    return shouldInclude(entry, filterBy, true, partialMatch) &&
           shouldInclude(entry, excludeBy, false, partialMatch)
  })
}

/**
 * Determines whether a document entry should be included based on the provided criteria.
 * 
 * @template D - The type of the document entry.
 * @param {D} entry - The document entry to evaluate.
 * @param {Filter<D> | undefined} criteria - The filter criteria to apply.
 * @param {boolean} inclusion - Whether to include or exclude the entry based on the criteria.
 * @param {boolean} partialMatch - Indicates whether partial string matching is enabled.
 * @returns {boolean} True if the entry should be included, otherwise false.
 */
function shouldInclude<D>(entry: D, criteria: Filter<D> | undefined, inclusion: boolean, partialMatch: boolean) {
  return !criteria || Object.entries(criteria).every(([key, value]) => {
    /** If the filter value is not defined, it is ignored */
    if (value === undefined) return true

    /**
     * Value of the property corresponding
     * to the key from the document entry.
     */
    const entryValue = entry[key as keyof D]

    /** 
     * Performs partial string matching if enabled, by checking if the
     * lowercase entry value includes the lowercase filter value.
     */
    if (partialMatch && typeof value === 'string' && typeof entryValue === 'string') {
      return entryValue.toLowerCase().includes(value.toLowerCase()) === inclusion
    }

    /**
     * If the filter value is an array, check if the entry value matches
     * any value in the array. (Otherwise, perform a strict equality check.)
     * 
     * In both cases inclusion is checked (filter or exclude).
     */
    return Array.isArray(value)
      ? value.includes(entryValue) === inclusion
      : value === entryValue === inclusion
  })
}

export default filter
