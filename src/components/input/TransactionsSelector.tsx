// shadcn
import { MultiSelect, OptionType } from "@/components/ui/multi-select"

// hooks
import { useTransactions } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionsSelectorProps = {
  value: string[]
  onChange: () => void
} & FilterOptions<Transaction>

const TransactionsSelector = ({ value, onChange, filterBy, excludeBy }: TransactionsSelectorProps) => {
  const { data: transactions, isLoading } = useTransactions({
    filter: { filterBy, excludeBy }
  })

  return (
    <MultiSelect
      selected={value}
      options={transactions ? transactions.reduce((options, tr) => ([
        ...options,{
          label: tr.name,
          value: tr.id
        }
      ]), [] as OptionType[]) : []}
      onChange={onChange}
      disabled={isLoading}
    />
  )
}

export default TransactionsSelector
