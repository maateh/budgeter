// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// hooks
import { useBudgets } from "@/lib/react-query/queries"

type BudgetSelectorProps = {
  defaultValue: string
  onChange: () => void
}

const BudgetSelector = ({ defaultValue, onChange }: BudgetSelectorProps) => {
  const { data: budgets, isLoading } = useBudgets()

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
        {budgets && budgets.map(b => (
          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default BudgetSelector
