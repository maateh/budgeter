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

    // FIXME: it's so annoying, I can't even believe.
    // 'trailingZeroDisplay' does not exist in type of 'NumberFormatOptions'
    // even on the newest version of TS. It's a widely available option through
    // modern browsers (92+%) so I'm ignoring this type of option while
    // the problem won't be resolved.
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
