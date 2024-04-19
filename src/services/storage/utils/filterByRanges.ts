// types
import { Range, RangeFilter } from "@/services/api/types"

// TODO: write documentation
function filterByRanges<T>(documents: T[], ranges?: RangeFilter): T[] {
  return documents.filter((document) => {
    for (const keyRef in ranges) {
      const range = ranges[keyRef]

      let value: number | undefined
      keyRef.split('.')
        .reduce((doc, key) => {
          const nestedValue = doc[key as keyof T] as (T | number)
          if (typeof nestedValue === 'number') {
            value = nestedValue
            return doc
          }
          return nestedValue
        }, document as T)

      if (!isInRange(value, range)) {
        return false
      }
    }
    return true
  })
}

function isInRange(value: number | undefined, range?: Range): boolean {
  if (!value || !range) return true

  if (range.min !== undefined && value < range.min) return false
  if (range.max !== undefined && value > range.max) return false

  return true
}

export default filterByRanges
