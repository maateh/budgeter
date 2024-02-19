// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// hooks
import { useLoadBudgetsQuery } from "@/hooks/queries"

type BudgetSelectorProps = {
  defaultValue: string
  onChange: () => void
}

const BudgetSelector = ({ defaultValue, onChange }: BudgetSelectorProps) => {
  const { data: budgets, isLoading } = useLoadBudgetsQuery()

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
        {budgets && Object.values(budgets).map(b => (
          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default BudgetSelector
