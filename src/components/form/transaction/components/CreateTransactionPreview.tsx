// icons
import { AlertTriangle } from "lucide-react"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import { BalanceUpdatePreview, BalanceUpdatePreviewSkeleton } from "@/components/shared/budget/BalanceUpdatePreview"

// hooks
import { useBudget } from "@/lib/react-query/queries"

// types
import { Payment } from "@/services/api/types"

type CreateTransactionPreviewProps = {
  budgetId?: string
  payment: Payment
}

const CreateTransactionPreview = ({ budgetId, payment }: CreateTransactionPreviewProps) => {
  const { data: budget, isLoading } = useBudget(budgetId!, { enabled: !!budgetId })

  if (isLoading) {
    return <BalanceUpdatePreviewSkeleton />
  }

  if (!budget) {
    return (
      <InfoBadge className="min-w-40 w-fit mx-auto px-5 py-2"
        separatorProps={{ className: 'hidden' }}
        valueProps={{ className: "text-sm font-normal break-words" }}
        size="sm"
        variant="destructive"
        icon={<AlertTriangle className="text-destructive" />}
        value="Select a budget to see the preview."
      />
    )
  }

  return <BalanceUpdatePreview budget={budget} payment={payment} />
}

export default CreateTransactionPreview
