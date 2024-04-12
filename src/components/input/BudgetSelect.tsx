// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectTriggerProps, SelectValue } from "@/components/ui/select"

// hooks
import { useBudgets } from "@/lib/react-query/queries"
import { cn } from "@/lib/utils"

// types
import { Budget, FilterOptions } from "@/services/api/types"

type BudgetSelectProps = {
  value?: string
  setValue: (id: string) => void
} & FilterOptions<Budget> & Omit<SelectTriggerProps, 'value'>

const BudgetSelect = ({ value, setValue, filterBy, excludeBy, ...props }: BudgetSelectProps) => {
  const { data: budgets, isLoading } = useBudgets({
    filter: { filterBy, excludeBy }
  })

  return (
    <Select
      value={value}
      onValueChange={setValue}
      disabled={!budgets || isLoading}
    >
      <SelectTrigger className={cn(!value && "text-muted-foreground")} {...props}>
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        {budgets?.map((budget) => (
          <SelectItem key={budget.id} value={budget.id}>
            {budget.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default BudgetSelect
