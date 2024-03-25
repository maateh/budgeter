// icons
import { AlertTriangle } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransferElementProps = {
  budget: Budget
  payment: Transaction['payment']
  isRoot?: boolean
}

const TransferElement = ({ budget, payment, isRoot }: TransferElementProps) => (
  <div className="min-w-40 flex flex-col items-center gap-y-1.5">
    <p className="font-heading font-medium">{isRoot ? 'Root' : 'Target'} Budget</p>

    <Separator className="w-1/3" />

    <BudgetNameBadge budget={budget} size="sm" />

    <div className="flex flex-wrap-reverse justify-center items-center gap-x-2 gap-y-1.5">
      <PaymentBadge
        transaction={{
          payment,
          type: 'default',
          processed: true
        }}
        currency={budget.balance.currency}
      />

      <BalanceBadge
        separatorProps={{ className: "h-5" }}
        orientation="vertical"
        size="sm"
        iconSize={18}
        balance={budget.balance}
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
    <div className="w-full flex flex-wrap justify-around gap-4">
      <div className="flex-1">
        <TransferElement
          budget={rootBudget}
          payment={payment}
          isRoot
        />
      </div>

      <div className="flex-1">
        {targetBudget ? (
          <TransferElement
            budget={targetBudget}
            payment={{
              ...payment,
              type: payment.type === '+' ? '-' : '+'
            }}
          />
        ) : (
          <InfoBadge className="min-w-40 w-fit mx-auto my-auto px-4 py-2"
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
