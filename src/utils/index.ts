import { Pagination } from "@/services/api/types"
import { InfiniteData } from "@tanstack/react-query"

export function formatWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    trailingZeroDisplay: 'stripIfInteger',
    currency
  }).format(amount)
}

export function getNextPageOffset<T>(data: InfiniteData<Pagination<T>, unknown> | undefined): number | null {
  if (!data) return null

  const lastIndex = data.pages.length - 1
  return data.pages[lastIndex].nextPageOffset
}
