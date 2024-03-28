// icons
import { Banknote, Handshake } from "lucide-react"

// shadcn
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { Budget, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type PaymentProgressProps = {
  transaction: Transaction & { budget: Budget }
}

const PaymentProgress = ({ transaction }: PaymentProgressProps) => {
  return (
    <div>
      <p className="text-base text-center font-heading">
        Progress of subpayments
      </p>

      <Separator className="w-3/5 mx-auto mt-1 mb-1.5 sm:w-2/5" />

      {/* TODO: redesign progress ui component */}
      <Progress className="min-w-32 max-w-sm mx-auto"
        maxValue={transaction.payment.amount}
        value={transaction.payment.paidBackAmount}
      />

      <div className="mx-0.5 my-2.5 flex justify-between gap-x-1.5 sm:mx-6 sm:gap-x-2.5">
        <InfoBadge className="min-w-24 px-6"
          variant="outline"
          size="sm"
          icon={<Banknote size={18} />}
          label="Paid Back"
          value={formatWithCurrency(
            transaction.payment.paidBackAmount || 0,
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
    </div>
  )
}

export default PaymentProgress
