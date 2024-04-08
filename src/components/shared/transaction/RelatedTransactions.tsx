// icons
import { BadgeInfo, X } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import TransactionList from "@/components/shared/transaction/TransactionList"
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"
import RelatedTransactionsForm from "@/components/form/related-transactions/RelatedTransactionsForm"

// hooks
import { useDialog } from "@/hooks"
import { useRemoveRelatedTransaction } from "@/lib/react-query/mutations"

// types
import { Budget, Transaction } from "@/services/api/types"

type RelatedTransactionsProps = {
  transaction: Transaction
  budget: Budget
}

const RelatedTransactions = ({ transaction }: RelatedTransactionsProps) => {
  const { openDialog } = useDialog()

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

      {transaction.relatedIds.length ? (
        <TransactionList
          filter={{ filterBy: { id: transaction.relatedIds }}}
          params={{ limit: 5, offset: 0 }}
        >
          {(transaction, budget) => (
            <div className="flex gap-x-2 items-center">
              <TransactionPreview
                transaction={transaction}
                budget={budget}
                onClick={() => openDialog(`/transactions/details/${transaction.id}`, {
                  replace: true
                })}
              />

              <ButtonTooltip className="p-0.5"
                variant="icon"
                size="icon"
                onClick={() => handleRemove(transaction.id)}
                disabled={isPending}
                tooltip="Remove as related"
                tooltipProps={{ className: "bg-background/85 border-muted-foreground/50 text-muted-foreground text-xs font-heading" }}
              >
                <X size={13} strokeWidth={2.85} />
              </ButtonTooltip>
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
