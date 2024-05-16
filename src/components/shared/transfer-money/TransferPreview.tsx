// icons
import { AlertTriangle } from "lucide-react"

// components
import BalanceUpdatePreview from "@/components/shared/budget/BalanceUpdatePreview"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { Budget, Payment } from "@/services/api/types"

type TransferPreviewProps = {
  rootBudget: Budget
  targetBudget?: Budget
  payment: Payment
}

const TransferPreview = ({ rootBudget, targetBudget, payment }: TransferPreviewProps) => {
  return (
    <div className="w-full flex flex-wrap justify-around items-center gap-x-4 gap-y-8">
      <div className="flex-1">
        <p className="mb-1.5 text-center text-muted-foreground font-heading font-medium overline">
          Root Budget
        </p>

        <BalanceUpdatePreview
          budget={rootBudget}
          payment={{
            ...payment,
            type: payment.type === '+' ? '-' : '+'
          }}
        />
      </div>

      <div className="flex-1">
        <p className="mb-1.5 text-center text-muted-foreground font-heading font-medium overline">
          Target Budget
        </p>
        {targetBudget ? (
          <BalanceUpdatePreview
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
