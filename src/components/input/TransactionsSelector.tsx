// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// hooks
import { useTransactions } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionsSelectorProps = {
  defaultValue?: string[]
  onChange: () => void
} & FilterOptions<Transaction>

const TransactionsSelector = ({ defaultValue, onChange, filterBy, excludeBy }: TransactionsSelectorProps) => {
  const { data: transactions, isLoading } = useTransactions({
    filter: { filterBy, excludeBy }
  })

  // TODO: implement multi-select input
  return (
    <Select
      // defaultValue={defaultValue}
      disabled={!transactions || isLoading}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        {transactions?.map((transaction) => (
          <SelectItem key={transaction.id} value={transaction.id}>
            {transaction.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TransactionsSelector
