/**
 * Formats the given amount with the specified currency.
 * @param amount - The amount to format.
 * @param currency - The currency code or symbol to use for formatting.
 * @returns A formatted string representing the amount with currency.
 */
export function formatWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    trailingZeroDisplay: 'stripIfInteger',
    currency
  }).format(amount)
}
