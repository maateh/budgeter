
// icons
import { BadgeInfo } from "lucide-react"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { BadgeProps } from "@/components/ui/badge"
import { Payment } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type PaymentListProps = {
  payments?: Payment[]
  firstElement?: React.ReactNode
  lastElement?: React.ReactNode
  infoBadgeProps?: BadgeProps
  children: (payment: Payment) => React.ReactNode
} & Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>

const PaymentList = ({ payments, firstElement, lastElement, infoBadgeProps, children, className, ...props }: PaymentListProps) => {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-2 gap-y-1.5", className)} {...props}>
      {firstElement && <li>{firstElement}</li>}

      {payments?.length ? payments.map((payment) => (
        <li key={payment.id}>
          {children(payment)}
        </li>
      )) : (
        <InfoBadge
          separatorProps={{ className: "h-4" }}
          valueProps={{ className: "text-sm font-body font-normal break-words" }}
          orientation="vertical"
          variant="destructive"
          size="sm"
          icon={<BadgeInfo className="text-destructive" size={20} />}
          value="No payments to show."
          {...infoBadgeProps}
        />
      )}

      {lastElement && <li>{lastElement}</li>}
    </ul>
  )
}

export default PaymentList
