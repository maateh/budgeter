export type FilterKeys = 'filterBy' | 'excludeBy' | 'rangeBy'

export type FilterOptions<T> = {
  filterBy?: Filter<T>
  excludeBy?: Filter<T>
  rangeBy?: RangeFilter
  partialMatch?: boolean
}

// basic filter
export type Filter<T> = {
  [K in keyof T]?: T[K] | T[K][]
} | {
  [keyRef: string]: unknown
}

// range filter
export type Range = {
  min?: number
  max?: number
}

export type RangeFilter = {
  [keyRef: string]: Range
}

export type RangeFilterEntryValue = number | string | undefined
