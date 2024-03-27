// components
import TransactionList from "@/components/shared/transaction/TransactionList"

// types
import { Budget, Transaction } from "@/services/api/types"

type RelatedTransactionsProps = {
  transaction: Transaction & { budget: Budget }
}

const RelatedTransactions = ({ transaction }: RelatedTransactionsProps) => {
  // TODO: implement layout
  return (
    <TransactionList
      maxItemLimit={3}
      // filterBy={{ id: transaction.related }} // TODO: add option to filter by not just a single value
    />
  )
}

export default RelatedTransactions