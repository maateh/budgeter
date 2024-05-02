// icons
import { BadgePlus, Banknote, Handshake } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import Listing from "@/components/ui/custom/Listing"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"

// hooks
import { useBudget, usePayments, useTransaction } from "@/lib/react-query/queries"

// types
import { Payment } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type PaymentProgressProps = {
  payment: Payment
  transactionId?: never
  budgetId?: never
} | {
  transactionId: string
  budgetId: string
  payment?: never
}

const PaymentProgress = ({ payment, transactionId, budgetId }: PaymentProgressProps) => {
  const {
    data: budget,
    isLoading: isBudgetLoading
  } = useBudget(payment ? payment.budgetId : budgetId)

  const {
    data: transaction,
    isLoading: isTransactionLoading
  } = useTransaction(payment ? payment.transactionId : transactionId)

  const {
    data: subpayments,
    isLoading: isSubpaymentsLoading
  } = usePayments({
    filter: {
      filterBy: {
        transactionId: payment ? payment.transactionId : transactionId,
        isSubpayment: true
      }
    },
    sortBy: { createdAt: -1 }
  })

  if (isBudgetLoading || isTransactionLoading || !budget || !transaction) {
    return <>Loading...</> // TODO: skeleton
  }

  return (
    <>
      {!isSubpaymentsLoading && subpayments ? (
        <Listing className="mb-2.5 flex flex-wrap flex-row gap-x-1.5 gap-y-1"
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
                  <span>New</span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent>
                <SubpaymentForm budgetId={budget.id} transactionId={transaction.id} />
              </PopoverContent>
            </Popover>
          )}
        >
          {(payment) => (
            <PaymentBadge
              payment={payment}
              processed={true}
              currency={budget.balance.currency}
              showRemoveButton
              showProgress
              transaction={transaction}
              budgetName={budget.name}
            />
          )}
        </Listing>
      ) : (
        <>Loading...</> // TODO: skeleton
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

      <div className="mx-0.5 mt-2.5 flex justify-between gap-x-1.5 sm:mx-6 sm:gap-x-2.5">
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
