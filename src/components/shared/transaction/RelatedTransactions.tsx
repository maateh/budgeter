// icons
import { BadgeInfo, X } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import TransactionList from "@/components/shared/transaction/TransactionList"
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"
import RelatedTransactionsForm from "@/components/form/related-transactions/RelatedTransactionsForm"

// hooks
import { useRemoveRelatedTransaction } from "@/lib/react-query/mutations"

// types
import { Budget, Transaction } from "@/services/api/types"

type RelatedTransactionsProps = {
  transaction: Transaction
  budget: Budget
}

const RelatedTransactions = ({ transaction }: RelatedTransactionsProps) => {
  const { mutateAsync: removeRelated, isPending } = useRemoveRelatedTransaction(transaction.id)

  const handleRemove = async (relatedId: string) => {
    try {
      await removeRelated({
        id: transaction.id,
        relatedId
      })

      // TODO: show toast
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <RelatedTransactionsForm transaction={transaction} />

      <Separator className="w-3/5 mx-auto my-3.5" />

      {transaction.related.length ? (
        <TransactionList
          // FIXME: maxItemLimit doesn't work
          maxItemLimit={3}
          filterBy={{ id: transaction.related }}
        >
          {({ transaction, budget }) => (
            <div className="flex gap-x-2.5 items-center">
              <TransactionPreview
                transaction={transaction}
                budget={budget}
              />

              <Button className="p-1"
                variant="outline"
                size="icon"
                onClick={() => handleRemove(transaction.id)}
                disabled={isPending}
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </TransactionList>
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
