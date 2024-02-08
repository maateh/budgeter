export function formatWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currency: 'HUF' // TODO: add valid custom currency after it's implemented
  }).format(amount)
}
