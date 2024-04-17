export type DebounceHookOptions<T> = {
  value: T
  delay?: number
}

export type DebounceHookReturn<T> = {
  debouncedValue: T
}
