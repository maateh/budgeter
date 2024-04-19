export type FilterKeys = 'filterBy' | 'excludeBy' | 'rangeBy'

export type Filter<T> = {
  [K in keyof T]?: T[K] | T[K][]
}

export type Range = {
  min?: number
  max?: number
}

export type RangeFilter = {
  [keyRef: string]: Range
}

export type FilterOptions<T> = {
  filterBy?: Filter<T>
  excludeBy?: Filter<T>
  rangeBy?: RangeFilter
  partialMatch?: boolean
}
