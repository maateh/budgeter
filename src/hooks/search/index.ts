import { useSearchParams } from "react-router-dom"

// types
import { SearchReturn } from "@/hooks/search/types"

// constants
import { ENTRY_SEPARATOR, PARAM_SPLITTER } from "@/hooks/search/constants"

/**
 * Provides functionality to manage search parameters in the URL search string.
 * 
 * @template ParamKeys - The keys of the search parameters.
 * @template T - The type of the search parameter values.
 * @returns {SearchReturn<ParamKeys, T>} An object containing functions to manage search parameters.
 */
function useSearch<ParamKeys extends string, T extends object>(): SearchReturn<ParamKeys, T> {
  const [searchParams, setSearchParams] = useSearchParams()

  /**
   * Retrieves a search parameter value based on the provided key.
   * 
   * @param {ParamKeys} key - The key of the search parameter.
   * @returns {T} The value of the search parameter.
   */
  const getParam = (key: ParamKeys): T => {
    const searchParam = searchParams.get(key)
    if (!searchParam) return {} as T
  
    const param: T = searchParam.split(PARAM_SPLITTER)
      .reduce((param, record) => {
        const [key, value] = record.split(ENTRY_SEPARATOR)
        return { ...param, [key]: value }
      }, {} as T)
  
    return param
  }

  /**
   * Converts a partial search parameter object to a URL search parameter string.
   * 
   * @param {Partial<T>} param - The partial search parameter object.
   * @returns {string} The URL search parameter string.
   */
  const convertToSearchParam = (param: Partial<T>): string => {
    return Object.entries(param)
      .reduce((searchParam, [key, value]) => {
        if (!value) return searchParam

        const searchParamEntry = `${key}${ENTRY_SEPARATOR}${value}`
        return searchParam.concat(searchParamEntry)
      }, [] as string[])
      .join(PARAM_SPLITTER)
  }

  /**
   * Sets a search parameter value based on the provided key and entry.
   * 
   * @param {ParamKeys} paramKey - The key of the search parameter.
   * @param {Partial<T>} entry - The partial search parameter entry to set.
   */
  const setParam = (paramKey: ParamKeys, entry: Partial<T>) => {
    setSearchParams((searchParams) => {
      const searchParam = convertToSearchParam(entry)
      searchParams.set(paramKey, searchParam)
  
      if (!searchParam) searchParams.delete(paramKey)
      return searchParams
    })
  }

  /**
   * Clears a search parameter based on the provided key.
   * 
   * @param {ParamKeys} paramKey - The key of the search parameter to clear.
   */
  const clearParam = (paramKey: ParamKeys) => {
    setSearchParams((searchParams) => {
      searchParams.delete(paramKey)
      return searchParams
    })
  }

  /**
   * Sets a search parameter entry based on the provided key and entry.
   * 
   * @param {ParamKeys} paramKey - The key of the search parameter.
   * @param {Partial<T> | undefined} entry - The partial search parameter entry to set.
   */
  const setParamEntry = (paramKey: ParamKeys, entry: Partial<T> | undefined) => {
    const param = getParam(paramKey)
    setParam(paramKey, { ...param, ...entry })
  }

  /**
   * Removes a search parameter entry based on the provided key and entry key.
   * 
   * @param {ParamKeys} paramKey - The key of the search parameter.
   * @param {keyof T} entryKey - The key of the search parameter entry to remove.
   */
  const removeParamEntry = (paramKey: ParamKeys, entryKey: keyof T) => {
    setSearchParams((searchParams) => {
      const param = getParam(paramKey)
      delete param[entryKey]

      const searchParam = convertToSearchParam(param)
      searchParams.set(paramKey, searchParam)

      if (!searchParam) searchParams.delete(paramKey)
      return searchParams
    })
  }

  return {
    params: [], // TODO: get every params
    getParam, convertToSearchParam,
    setParamEntry, removeParamEntry, setParam, clearParam
  }
}

export default useSearch
