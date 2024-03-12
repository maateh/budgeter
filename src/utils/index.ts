export function formatWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    trailingZeroDisplay: 'stripIfInteger',
    currency
  }).format(amount)
}

export function customFilter<T>(filterBy: Partial<T>) {
  return (entry: T) => Object.keys(filterBy)
    .every((key) => filterBy[key as keyof T] === entry[key as keyof T])
}
