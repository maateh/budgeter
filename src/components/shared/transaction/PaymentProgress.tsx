// icons
import { BadgePlus, Banknote, Handshake } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import PaymentList from "@/components/shared/transaction/PaymentList"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"

// hooks
import { usePayments } from "@/lib/react-query/queries"

// types
import { Budget, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type PaymentProgressProps = {
  transaction: Transaction & { budget: Budget }
}

const PaymentProgress = ({ transaction }: PaymentProgressProps) => {
  const { data: subpayments } = usePayments({
    filterBy: { transactionId: transaction.id, isSubpayment: true }
  })

  return (
    <>
      <PaymentList className="mb-2.5"
        payments={subpayments}
        firstElement={(
          <Popover>
            <PopoverTrigger>
              <li>
                <Badge className="cursor-pointer icon-wrapper"
                  variant="outline"
                  size="sm"
                >
                  <BadgePlus size={20} />
                  <span>New</span>
                </Badge>
              </li>
            </PopoverTrigger>
            <PopoverContent>
              <SubpaymentForm transactionId={transaction.id} />
            </PopoverContent>
          </Popover>
        )}
      >
        {(payment) => (
          <PaymentBadge
            payment={payment}
            processed={true}
            currency={transaction.budget.balance.currency}
            showRemoveButton
          />
        )}
      </PaymentList>

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
            transaction.budget.balance.currency
          )}
        />

        <InfoBadge className="min-w-24 px-6"
          variant="outline"
          size="sm"
          icon={<Handshake size={18} />}
          label="Total"
          value={formatWithCurrency(
            transaction.payment.amount,
            transaction.budget.balance.currency
          )}
        />
      </div>
    </>
  )
}

export default PaymentProgress
