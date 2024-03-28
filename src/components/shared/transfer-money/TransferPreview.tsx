// icons
import { AlertTriangle, ArrowDown } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { Budget, Payment, Transaction } from "@/services/api/types"

type TransferElementProps = {
  budget: Budget
  payment: Payment
  isRoot?: boolean
}

const TransferElement = ({ budget, payment, isRoot }: TransferElementProps) => (
  <div className="min-w-40 flex flex-col items-center gap-y-1.5">
    <p className="text-muted-foreground font-heading font-medium overline">
      {isRoot ? 'Root' : 'Target'} Budget
    </p>

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

      <PaymentBadge
        payment={payment}
        processed={true}
        currency={budget.balance.currency}
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

type TransferPreviewProps = {
  rootBudget: Budget
  targetBudget?: Budget
  payment: Transaction['payment']
}

const TransferPreview = ({ rootBudget, targetBudget, payment }: TransferPreviewProps) => {
  return (
    <div className="w-full flex flex-wrap justify-around items-center gap-x-4 gap-y-8">
      <div className="flex-1">
        <TransferElement
          budget={rootBudget}
          payment={{
            ...payment,
            type: payment.type === '+' ? '-' : '+'
          }}
          isRoot
        />
      </div>

      <div className="flex-1">
        {targetBudget ? (
          <TransferElement
            budget={targetBudget}
            payment={payment}
          />
        ) : (
          <InfoBadge className="min-w-40 w-fit mx-auto px-4 py-2"
            separatorProps={{ className: 'hidden' }}
            valueProps={{ className: "break-words" }}
            size="sm"
            variant="destructive"
            icon={<AlertTriangle className="text-destructive" />}
            value="Select a target budget to see the preview."
          />
        )}
      </div>
    </div>
  )
}

export default TransferPreview
