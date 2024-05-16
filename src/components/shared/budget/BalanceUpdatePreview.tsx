// icons
import { ArrowDown } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BudgetNameBadge from "@/components/shared/budget/ui/BudgetNameBadge"
import BalanceBadge from "@/components/shared/budget/ui/BalanceBadge"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"

// types
import { Budget, Payment } from "@/services/api/types"

type BalanceUpdatePreviewProps = {
  budget: Budget
  payment: Payment
}

const BalanceUpdatePreview = ({ budget, payment }: BalanceUpdatePreviewProps) => {
  return (
    <div className="min-w-40 flex flex-col items-center gap-y-1.5">
      <BudgetNameBadge budget={budget} size="sm" />

      <Separator className="w-1/3" />

      <div className="flex flex-col justify-center items-center gap-y-1">
        <BalanceBadge
          separatorProps={{ className: "h-4" }}
          orientation="vertical"
          size="sm"
          iconSize={18}
          balance={budget.balance}
        />

        <PaymentBadge className="border-2"
          payment={payment}
          currency={budget.balance.currency}
          processed
        />

        <ArrowDown className={payment.type === '+' ? 'text-accent' : 'text-destructive'}
          strokeWidth={7}
        />

        <BalanceBadge
          separatorProps={{ className: "h-4" }}
          orientation="vertical"
          size="sm"
          iconSize={18}
          balance={{
            ...budget.balance,
            current: budget.balance.current - (payment.type === '+' ? -payment.amount : payment.amount)
          }}
        />
      </div>
    </div>
  )
}

export { BalanceUpdatePreview }
export { default as BalanceUpdatePreviewSkeleton } from './BalanceUpdatePreview.skeleton'
