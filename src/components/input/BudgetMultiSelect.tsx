// shadcn
import { MultiSelect, MultiSelectProps, OptionType } from "@/components/ui/multi-select"

// hooks
import { useBudgets } from "@/lib/react-query/queries"
import { Budget, FilterOptions } from "@/services/api/types"

type BudgetMultiSelectProps = {
  selected: string[]
  onSelect: (ids: React.SetStateAction<string[]>) => void
  filter?: FilterOptions<Budget>
} & Omit<MultiSelectProps, 'options'>

const BudgetMultiSelect = ({ selected, onSelect, filter }: BudgetMultiSelectProps) => {
  const { data: budgets, isLoading } = useBudgets({ filter })

  return (
    <MultiSelect
      selected={selected}
      onSelect={onSelect}
      disabled={isLoading || !budgets}
      options={budgets ? budgets.reduce((options, budget) => ([
        ...options, {
          label: budget.name,
          value: budget.id
        }
      ]), [] as OptionType[]) : []}
    />
  )
}

export default BudgetMultiSelect
