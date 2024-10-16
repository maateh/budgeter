// icons
import { BadgePlus, Banknote, Handshake } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SkeletonList } from "@/components/ui/skeleton"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import Listing from "@/components/ui/custom/Listing"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"
import PaymentProgressSkeleton from "@/components/shared/payment/PaymentProgress.skeleton"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useBudget, useSubpayments } from "@/lib/react-query/queries"
import { useRemoveSubpayment } from "@/lib/react-query/mutations"

// types
import { Subpayment, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { getPaymentAmount } from "@/components/shared/payment/utils"

type PaymentProgressProps = {
  transaction: Transaction
}

const PaymentProgress = ({ transaction }: PaymentProgressProps) => {
  const { toast } = useToast()

  const { data: budget, isLoading: isBudgetLoading } = useBudget(transaction.budgetId)

  const { data: subpayments, isLoading: isSubpaymentsLoading } = useSubpayments({
    filter: {
      filterBy: { transactionId: transaction.id },
      excludeBy: { isBorrowmentRoot: true }
    },
    sortBy: { createdAt: -1 }
  })

  const {
    mutateAsync: removeSubpayment,
    isPending: isSubpaymentRemovePending
  } = useRemoveSubpayment(transaction.id)

  const handleRemove = async (subpayment: Subpayment) => {
    try {
      await removeSubpayment({
        transactionId: transaction.id,
        subpaymentId: subpayment.id
      })

      toast({
        title: `Removed subpayment: ${formatWithCurrency(
          getPaymentAmount({
            amount: subpayment.amount,
            processed: transaction.payment.processed
          }),
          budget!.balance.currency
        )}`,
        // TODO: add undo
        description: `Affected transaction: ${transaction!.name}`
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: 'Oops! Deletion failed.',
        description: 'Please try again.'
      })
    }
  }

  if (isBudgetLoading || !budget) {
    return <PaymentProgressSkeleton />
  }

  return (
    <>
      {!isSubpaymentsLoading && subpayments ? (
        <Listing className="mb-2.5 flex flex-wrap flex-row justify-center items-center gap-x-1.5 gap-y-1"
          items={subpayments}
          fallbackProps={{ size: "xs", value: 'No payments to show.' }}
          firstElement={(
            <Popover>
              <PopoverTrigger>
                <Badge className="cursor-pointer icon-wrapper"
                  variant="outline"
                  size="sm"
                >
                  <BadgePlus size={20} />
                  New
                </Badge>
              </PopoverTrigger>
              <PopoverContent>
                <SubpaymentForm budgetId={budget.id} transactionId={transaction.id} />
              </PopoverContent>
            </Popover>
          )}
        >
          {(subpayment) => (
            <PaymentBadge
              payment={subpayment}
              processed
              currency={budget.balance.currency}
              showProgress
              showDetailsOnly
              transaction={transaction}
              budgetName={budget.name}
              showRemoveButton
              onRemove={() => handleRemove(subpayment)}
              removeButtonProps={{ disabled: isSubpaymentRemovePending }}
            />
          )}
        </Listing>
      ) : (
        <SkeletonList className="mb-2.5 flex flex-row flex-wrap justify-center items-center gap-x-2.5 gap-y-1.5"
          itemProps={{ className: "w-20 h-5" }}
          amount={7}
        />
      )}

      <p className="text-base text-center font-heading">
        Progress of subpayments
      </p>

      <Separator className="w-3/5 mx-auto mt-1 mb-1.5" />

      <Progress className="min-w-32 max-w-sm mx-auto"
        variant={transaction.payment.processedAmount < 0 ? 'negative' : 'default'}
        maxValue={transaction.payment.amount}
        value={transaction.payment.processedAmount}
      />

      <div className="mx-0.5 mt-2.5 flex flex-wrap justify-around gap-x-4 gap-y-2 sm:mx-6 sm:gap-x-2.5">
        <InfoBadge className="flex-1 min-w-32 max-w-48 px-8"
          variant="outline"
          size="sm"
          icon={<Banknote size={18} />}
          label="Paid Back"
          value={formatWithCurrency(
            transaction.payment.processedAmount || 0,
            budget.balance.currency
          )}
        />

        <InfoBadge className="flex-1 min-w-32 max-w-48 px-8"
          variant="outline"
          size="sm"
          icon={<Handshake size={18} />}
          label="Total"
          value={formatWithCurrency(
            transaction.payment.amount,
            budget.balance.currency
          )}
        />
      </div>
    </>
  )
}

export default PaymentProgress
