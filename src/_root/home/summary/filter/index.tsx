// shadcn
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// components
import CurrencySelect from '@/components/input/CurrencySelect'
import FilterInput from '@/components/input/FilterInput'
import BudgetsFilter from './BudgetsFilter'
import CurrenciesFilter from './CurrenciesFilter'

const SummaryFilter = () => {
  /* TODO: option to filter by: budgets, currencies (multi-select) */
  /* TODO: option to calculate balance by a given currency (baseCurrency) */

  return (
    <div className="flex flex-wrap justify-between gap-x-8 gap-y-4">
      <div className="flex-auto w-3/5 min-w-40 space-y-2">
        <div className="flex gap-x-3 items-center">
          <p className="font-heading indent-border">
            <span className="text-accent overline">Filter</span> by
          </p>

          <Separator className="h-3.5 w-1 rounded-full bg-foreground/10" orientation="vertical" />

          <ul className="flex flex-wrap gap-x-2.5">
            <li>
              <Button className="border-ring/35 aria-selected:bg-accent/80 aria-selected:text-accent-foreground aria-selected:border"
                size="xs"
                aria-selected
              >
                Budgets
              </Button>
            </li>
            <li>
              <Button className="border-ring/35 aria-selected:bg-accent/80 aria-selected:text-accent-foreground aria-selected:border"
                size="xs"
              >
                Currencies
              </Button>
            </li>
          </ul>
        </div>

        <BudgetsFilter />
        {/* <CurrenciesFilter /> */}
      </div>

      <FilterInput className="flex-auto justify-center w-1/5 min-w-28 max-w-44 ml-auto"
        labelProps={{ className: 'indent-border', htmlFor: 'currency' }}
        label={<><span className="text-accent overline">Calculate</span> by</>}
        onReset={() => {}}
      >
        {() => (
          <CurrencySelect id="currency" onChange={() => {}} />
        )}
      </FilterInput>
    </div>
  )
}

export default SummaryFilter
