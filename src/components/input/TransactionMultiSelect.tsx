// shadcn
import { MultiSelect, MultiSelectProps } from "@/components/ui/multi-select"

// hooks
import { useTransactions } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionMultiSelectProps = {
  selected: string[]
  onSelect: (ids: React.SetStateAction<string[]>) => void
  filter?: FilterOptions<Transaction>
} & Omit<MultiSelectProps, 'options'>

const TransactionMultiSelect = ({ selected, onSelect, filter, ...props }: TransactionMultiSelectProps) => {
  const { data: transactions, isLoading } = useTransactions({
    filter,
    sortBy: { updatedAt: -1 }
  })

  return (
    <MultiSelect
      selected={selected}
      onSelect={onSelect}
      disabled={isLoading || !transactions}
      options={transactions ? transactions.map((tr) => ({ label: tr.name, value: tr.id })) : []}
      {...props}
    />
  )
}

export default TransactionMultiSelect
