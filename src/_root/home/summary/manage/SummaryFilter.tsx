// shadcn
import { Label } from '@/components/ui/label'
import { MultiSelect, OptionType } from '@/components/ui/multi-select'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// hooks
import { useBudgets } from '@/lib/react-query/queries'
import { useManageSummary } from './context'

// types
import { Budget } from '@/services/api/types'

const getOptions = (type?: 'budgets' | 'currencies', budgets?: Budget[]): OptionType[] => {
  if (!type || !budgets || !budgets.length) return []

  if (type === 'budgets') {
    return budgets.map(({ id, name }) => ({ value: id, label: name }))
  }

  const currencies = [...new Set(budgets.map(({ balance }) => balance.currency))]
  return currencies.map((currency) => ({
    value: currency,
    label: currency
  }))
}

const SummaryFilter = () => {
  const { type, selected, dispatch } = useManageSummary()

  const {
    data: budgets,
    isLoading: isBudgetsLoading
  } = useBudgets({}, { enabled: !!type })

  const handleChangeType = (type: 'budgets' | 'currencies') => {
    dispatch({ type: 'SET_TYPE', payload: type })
    dispatch({ type: 'SET_SELECTED', payload: [] })
  }

  return (
    <>
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Label className="text-base font-heading font-normal indent-border" htmlFor={type}>
          <span className="text-accent overline">Filter</span> by
        </Label>

        <Separator className="h-3.5 w-1 rounded-full bg-foreground/10" orientation="vertical" />

        <ToggleGroup type="single">
          <ToggleGroupItem value="budgets"
            size="xs"
            variant="outline"
            onClick={() => handleChangeType('budgets')}
          >
            Budgets
          </ToggleGroupItem>
          <ToggleGroupItem value="currencies"
            size="xs"
            variant="outline"
            onClick={() => handleChangeType('currencies')}
          >
            Currencies
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <MultiSelect className="py-2.5 bg-background/50"
        id={type}
        selected={selected}
        onSelect={(value) => dispatch({ type: 'SET_SELECTED', payload: value })}
        disabled={!type || isBudgetsLoading || !budgets}
        options={getOptions(type, budgets)}
      />
    </>
  )
}

export default SummaryFilter
