/**
 * Formats the given amount with the specified currency.
 * @param amount - The amount to format.
 * @param currency - The currency code or symbol to use for formatting.
 * @returns A formatted string representing the amount with currency.
 */
export function formatWithCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    trailingZeroDisplay: 'stripIfInteger',
    currency
  }).format(amount)
}

export function getPreferredCurrency(): string | undefined {
  const currency = localStorage.getItem('preferred_currency')
  if (currency) return currency
}

export function setPrefferedCurrency(currency?: string | null): void {
  if (!currency) {
    localStorage.removeItem('prefferred_currency')
    return
  }
  localStorage.setItem('preferred_currency', currency)
}
