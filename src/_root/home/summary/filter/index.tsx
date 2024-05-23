// components
import BudgetMultiSelect from '@/components/input/BudgetMultiSelect'
import CurrencyMultiSelect from '@/components/input/CurrencyMultiSelect'
import CurrencySelect from '@/components/input/CurrencySelect'
import FilterInput from '@/components/input/FilterInput'
import TypeSelect from './TypeSelect'

const SummaryFilter = () => {
  /* TODO: option to filter by: budgets, currencies (multi-select) */
  /* TODO: option to calculate balance by a given currency (baseCurrency) */

  return (
    <div className="flex flex-wrap justify-between items-end gap-x-8 gap-y-4">
      <FilterInput className="flex-auto w-3/5 min-w-40 gap-y-1"
        labelProps={{ htmlFor: 'budgets' }} // TODO: replace with type
        label={<TypeSelect />}
        onReset={() => {}}
      >
        {() => (
          // TODO: render based on type
          <BudgetMultiSelect className="bg-background/50 py-2.5"
            id="budgets" // TODO: replace with type
            selected={[]}
            onSelect={() => {}}
          />
          // <CurrencyMultiSelect
          //   selected={[]}
          //   onSelect={() => {}}
          // />
        )}
      </FilterInput>

      <FilterInput className="flex-auto w-1/5 min-w-36 max-w-56 ml-auto gap-y-1"
        labelProps={{ className: 'indent-border', htmlFor: 'currency' }}
        label={<><span className="text-accent overline">Calculate</span> by</>}
        onReset={() => {}}
      >
        {() => (
          <CurrencySelect className="h-fit py-2.5 bg-background/50 rounded-full"
            id="currency"
            onChange={() => {}} // TODO:
          />
        )}
      </FilterInput>
    </div>
  )
}

export default SummaryFilter
