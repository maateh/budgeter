// types
import { OptionType } from "@/components/ui/multi-select"
import { Budget } from "@/services/api/types"

const getUsedCurrencies = (budgets: Budget[]): OptionType[] => {
  const currencies = [...new Set(budgets.map(({ balance }) => balance.currency))]
  return currencies.map((currency) => ({
    value: currency,
    label: currency
  }))
}

const getSummaryOptions = (type?: 'budgets' | 'currencies', budgets?: Budget[]): OptionType[] => {
  if (!type || !budgets || !budgets.length) return []

  if (type === 'budgets') {
    return budgets.map(({ id, name }) => ({ value: id, label: name }))
  }

  return getUsedCurrencies(budgets)
}

export { getUsedCurrencies, getSummaryOptions }
