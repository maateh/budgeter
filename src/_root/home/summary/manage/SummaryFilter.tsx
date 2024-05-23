// shadcn
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// hooks
import { useBudgets } from '@/lib/react-query/queries'
import { useManageSummary } from './context'

const SummaryFilter = () => {
  const { type, dispatch } = useManageSummary()

  const { data: budgets, isLoading: isBudgetsLoading } = useBudgets()

  /* TODO: option to filter by: budgets, currencies (multi-select) */
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
            onClick={() => dispatch({ type: 'SET_TYPE', payload: 'budgets' })}
          >
            Budgets
          </ToggleGroupItem>
          <ToggleGroupItem value="currencies"
            size="xs"
            variant="outline"
            onClick={() => dispatch({ type: 'SET_TYPE', payload: 'currencies' })}
          >
            Currencies
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <MultiSelect className="py-2.5 bg-background/50"
        id={type}
        selected={[]}
        onSelect={() => {}}
        disabled={!type || isBudgetsLoading || !budgets}
        options={[]}
      />
    </>
  )
}

export default SummaryFilter
