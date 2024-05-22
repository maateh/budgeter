// shadcn
import { MultiSelect, MultiSelectProps, OptionType } from "@/components/ui/multi-select"

// hooks
import { useTransactions } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionMultiSelectProps = {
  selected: string[]
  setSelected: (ids: React.SetStateAction<string[]>) => void
  filter?: FilterOptions<Transaction>
} & Omit<MultiSelectProps, 'options'>

const TransactionMultiSelect = ({ selected, setSelected, filter }: TransactionMultiSelectProps) => {
  const { data: transactions, isLoading } = useTransactions({
    filter,
    sortBy: { updatedAt: -1 }
  })

  return (
    <MultiSelect
      selected={selected}
      setSelected={setSelected}
      disabled={isLoading || !transactions}
      options={transactions ? transactions.reduce((options, tr) => ([
        ...options,{
          label: tr.name,
          value: tr.id
        }
      ]), [] as OptionType[]) : []}
    />
  )
}

export default TransactionMultiSelect
