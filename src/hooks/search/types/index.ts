export type SearchReturn<ParamKeys extends string, T extends object> = {
  params: T[]
  searchParams: URLSearchParams
  getParam: (key: ParamKeys) => T
  convertToSearchParam: (param: Partial<T>) => string
  setParam: (paramKey: ParamKeys, entry: Partial<T>) => void
  clearParam: (paramKey: ParamKeys) => void
  setParamEntry: (paramKey: ParamKeys, entry: Partial<T> | undefined ) => void
  removeParamEntry: (paramKey: ParamKeys, entryKey: keyof T) => void
}
