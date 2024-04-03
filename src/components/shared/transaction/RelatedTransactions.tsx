// icons
import { BadgeInfo } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import TransactionList from "@/components/shared/transaction/TransactionList"
import RelatedTransactionsForm from "@/components/form/related-transactions/RelatedTransactionsForm"

// types
import { Budget, Transaction } from "@/services/api/types"

type RelatedTransactionsProps = {
  transaction: Transaction
  budget: Budget
}

const RelatedTransactions = ({ transaction }: RelatedTransactionsProps) => {
  return (
    <>
      <RelatedTransactionsForm transaction={transaction} />

      <Separator className="w-3/5 mx-auto my-3.5" />

      {transaction.related.length ? (
        <TransactionList
          // FIXME: maxItemLimit doesn't work
          maxItemLimit={3}
          filterBy={{ id: transaction.related }}
        />
      ) : (
        <InfoBadge className="max-w-fit mx-auto"
          separatorProps={{ className: "h-4" }}
          valueProps={{ className: "text-sm font-body font-normal break-words" }}
          orientation="vertical"
          variant="destructive"
          size="sm"
          icon={<BadgeInfo className="text-destructive" size={20} />}
          value="There are no related transactions to show."
        />
      )}
    </>
  )
}

export default RelatedTransactions
