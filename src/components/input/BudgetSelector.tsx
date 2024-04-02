// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// hooks
import { useBudgets } from "@/lib/react-query/queries"

// types
import { Budget, FilterOptions } from "@/services/api/types"

type BudgetSelectorProps = {
  defaultValue: string
  onChange: () => void
} & FilterOptions<Budget>

const BudgetSelector = ({ defaultValue, onChange, filterBy, excludeBy }: BudgetSelectorProps) => {
  const { data: budgets, isLoading } = useBudgets({
    filter: { filterBy, excludeBy }
  })

  return (
    <Select
      disabled={!budgets || isLoading}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        {budgets?.map(budget => (
          <SelectItem key={budget.id} value={budget.id}>
            {budget.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default BudgetSelector
