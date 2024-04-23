export type SearchSort = {
  [keyRef: string]: '1' | '-1' | undefined
}

export type SortHookReturn = {
  sortBy?: SearchSort,
  toggleSort: (key: string, fixedOrder?: '1' | '-1') => void
}
