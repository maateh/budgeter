// icons
import { AlertTriangle } from "lucide-react"

// components
import { BalanceUpdatePreview, BalanceUpdatePreviewSkeleton } from "@/components/shared/budget/BalanceUpdatePreview"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// hooks
import { useBudget, useExchangeRate } from "@/lib/react-query/queries"

// types
import { Payment } from "@/services/api/types"

type TransferPreviewProps = {
  rootBudgetId: string
  targetBudgetId?: string
  payment: Payment
  customExchangeRate?: number
}

const TransferPreview = ({ rootBudgetId, targetBudgetId, payment, customExchangeRate }: TransferPreviewProps) => {
  const {
    data: rootBudget,
    isLoading: isRootBudgetLoading
  } = useBudget(rootBudgetId)

  const {
    data: targetBudget,
    isLoading: isTargetBudgetLoading
  } = useBudget(targetBudgetId!, { enabled: !!targetBudgetId })

  const {
    data: exchangeRate,
    isLoading: isExchangeRateLoading
  } = useExchangeRate(
    rootBudget?.balance.currency || '',
    targetBudget?.balance.currency || '',
    { enabled: !!rootBudget && !!targetBudget && !customExchangeRate }
  )

  return (
    <div className="w-full flex flex-wrap justify-around items-center gap-x-4 gap-y-8">
      <div className="flex-1">
        <p className="mb-1.5 text-center text-muted-foreground font-heading font-medium overline">
          Root Budget
        </p>

        {rootBudget && !isRootBudgetLoading ? (
          <BalanceUpdatePreview
            budget={rootBudget}
            payment={{
              ...payment,
              type: payment.type === '+' ? '-' : '+'
            }}
          />
        ) : (
          <BalanceUpdatePreviewSkeleton />
        )}
      </div>

      <div className="flex-1">
        <p className="mb-1.5 text-center text-muted-foreground font-heading font-medium overline">
          Target Budget
        </p>
        {!isTargetBudgetLoading && !isExchangeRateLoading ? (
          targetBudget ? (
            <BalanceUpdatePreview
              budget={targetBudget}
              payment={{
                ...payment,
                amount: payment.amount * (customExchangeRate ? customExchangeRate : (exchangeRate || 1))
              }}
            />
          ) : (
            <InfoBadge className="min-w-40 w-fit mx-auto px-4 py-2"
              separatorProps={{ className: 'hidden' }}
              valueProps={{ className: "text-sm font-normal break-words" }}
              size="sm"
              variant="destructive"
              icon={<AlertTriangle className="text-destructive" />}
              value="Select a target budget to see the preview."
            />
          )
        ) : (
          <BalanceUpdatePreviewSkeleton />
        )}
      </div>
    </div>
  )
}

export default TransferPreview
