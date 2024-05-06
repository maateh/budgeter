// icons
import { BadgePlus, Banknote, Handshake } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton, SkeletonList } from "@/components/ui/skeleton"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import Listing from "@/components/ui/custom/Listing"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"

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
          getPaymentAmount(subpayment, transaction.payment.processed),
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
    return (
      <>
        <SkeletonList className="mb-3.5 flex flex-row flex-wrap justify-center gap-x-2.5 gap-y-1.5"
          itemProps={{ className: "w-24 h-8" }}
          amount={5}
        />

        <Skeleton className="w-2/5 h-4 mx-auto mb-2 rounded-sm" />
        <Separator className="w-3/5 mx-auto my-1.5" />
        <Skeleton className="h-4 min-w-32 max-w-sm mx-auto rounded-full" />

        <div className="mx-4 mt-2.5 flex justify-around gap-x-1.5">
          <Skeleton className="h-14 w-32 rounded-full" />
          <Skeleton className="h-14 w-32 rounded-full" />
        </div>
      </>
    )
  }

  return (
    <>
      {!isSubpaymentsLoading && subpayments ? (
        <Listing className="mb-2.5 flex flex-wrap flex-row items-center gap-x-1.5 gap-y-1"
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

      <Separator className="w-3/5 mx-auto mt-1 mb-1.5 sm:w-2/5" />

      {/* TODO: redesign progress ui component */}
      <Progress className="min-w-32 max-w-sm mx-auto"
        maxValue={transaction.payment.amount}
        value={transaction.payment.processedAmount}
      />

      <div className="mx-0.5 mt-2.5 flex justify-around gap-x-1.5 sm:mx-6 sm:gap-x-2.5">
        <InfoBadge className="min-w-24 px-6"
          variant="outline"
          size="sm"
          icon={<Banknote size={18} />}
          label="Paid Back"
          value={formatWithCurrency(
            transaction.payment.processedAmount || 0,
            budget.balance.currency
          )}
        />

        <InfoBadge className="min-w-24 px-6"
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
