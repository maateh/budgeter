// icons
import { BadgeInfo, BadgePlus } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"

// types
import { Budget, Transaction } from "@/services/api/types"

type SubpaymentsProps = {
  transaction: Transaction & { budget: Budget }
}

const Subpayments = ({ transaction }: SubpaymentsProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <ul className="flex flex-wrap gap-x-2.5 gap-y-2">
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

        {transaction.subpayments?.length ? transaction.subpayments.map((payment, index) => (
          <li key={index}>
            <PaymentBadge
              transaction={{ ...transaction, payment }}
              currency={transaction.budget.balance.currency}
            />
          </li>
        )) : (
          <InfoBadge
            separatorProps={{ className: "h-4" }}
            valueProps={{ className: "text-sm font-body font-normal break-words" }}
            orientation="vertical"
            variant="destructive"
            size="sm"
            icon={<BadgeInfo className="text-destructive" size={20} />}
            value="This transaction doesn't have any subpayment."
          />
        )}
      </ul>

      {/* TODO: redesign progress ui component */}
      <Progress className="max-w-96 min-w-32 mx-auto"
        maxValue={transaction.payment.amount}
        value={transaction.subpayments?.reduce((sum, payment) => sum + payment.amount, 0)}
      />
    </div>
  )
}

export default Subpayments
