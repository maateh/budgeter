// shadcn
import { MultiSelect, MultiSelectProps, OptionType } from "@/components/ui/multi-select"

// hooks
import { useTransactions } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionMultiSelectProps = {
  selected: string[]
  setSelected: (ids: React.SetStateAction<string[]>) => void
} & FilterOptions<Transaction> & Omit<MultiSelectProps, 'options'>

const TransactionMultiSelect = ({ selected, setSelected, filterBy, excludeBy }: TransactionMultiSelectProps) => {
  const { data: transactions, isLoading } = useTransactions({
    filter: { filterBy, excludeBy }
  })

  return (
    <MultiSelect
      selected={selected}
      setSelected={setSelected}
      options={transactions ? transactions.reduce((options, tr) => ([
        ...options,{
          label: tr.name,
          value: tr.id
        }
      ]), [] as OptionType[]) : []}
      disabled={isLoading}
    />
  )
}

export default TransactionMultiSelect
