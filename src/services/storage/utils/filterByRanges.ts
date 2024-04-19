// types
import { Range, RangeFilter, RangeFilterEntryValue } from "@/services/api/types"

// TODO: write documentation
function filterByRanges<T>(documents: T[], ranges?: RangeFilter): T[] {
  return documents.filter((document) => {
    for (const keyRef in ranges) {
      const range = ranges[keyRef]

      let entryValue: RangeFilterEntryValue
      keyRef.split('.')
        .reduce((doc, key) => {
          const nestedValue = doc[key as keyof T] as (T | number | string)
          if (typeof nestedValue === 'number' || typeof nestedValue === 'string') {
            entryValue = nestedValue
            return doc
          }
          return nestedValue
        }, document as T)

      if (!isInRange(entryValue, range)) {
        return false
      }
    }
    return true
  })
}

function isInRange(value: RangeFilterEntryValue, range?: Range): boolean {
  if (!value || !range) return true

  if (typeof value === 'string') {
    if (isNaN(Date.parse(value as string))) return true
    value = new Date(value).getTime()
  }

  if (range.min !== undefined && value < range.min) return false
  if (range.max !== undefined && value > range.max) return false

  return true
}

export default filterByRanges
