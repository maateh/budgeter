import { useLocation, useNavigate } from "react-router-dom"

// icons
import { BadgePlus } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// components
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { Budget } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type BudgetPreviewProps = {
  budget: Budget
}

const BudgetPreview = ({ budget }: BudgetPreviewProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="h-full px-3.5 py-3 flex flex-col justify-between gap-y-2.5 rounded-3xl bg-secondary/60 border"
      style={{ borderColor: budget.theme }}
    >
      <div className="w-full flex flex-wrap justify-between items-center gap-x-3.5 gap-y-2">
        <BudgetNameBadge className="h-fit text-sm text-center sm:text-md"
          budget={budget}
        />

        <BalanceBadge className="min-w-32 ml-auto px-3"
          separatorProps={{ className: "h-3" }}
          orientation="vertical"
          size="sm"
          iconSize={18}
          balance={budget.balance}
        />
      </div>
      
      <Separator className="mx-auto w-5/6" />

      {/* TODO: get budget transactions */}
      <ul className="flex flex-wrap items-end gap-x-2 gap-y-1">
        <li><Badge className="text-sm cursor-pointer icon-wrapper"
          variant="outline"
          size="xs"
          onClick={() => navigate(`/transactions/create/${budget.id}`, {
            state: { background: location }
          })}
        >
          <BadgePlus size={18} />
          <span>New</span>
        </Badge></li>

        {/* TODO: transactions required */}
        <li>payments</li>

        <li><Badge className="cursor-pointer"
          onClick={() => navigate(`/budgets/${budget.id}`)}
          variant="outline"
          size="xs"
        >
          View all
        </Badge></li>
      </ul>

      <div className="flex flex-wrap justify-end items-center gap-x-3.5 gap-y-2">
        <InfoBadge className="px-2.5 text-accent border-accent bg-background/65"
          separatorProps={{ className: 'h-3' }}
          size="xs"
          orientation="vertical"
          label="Income"
          value={formatWithCurrency(budget.balance.income, budget.balance.currency)}
        />

        <InfoBadge className="px-2.5 text-destructive border-destructive bg-background/65"
          separatorProps={{ className: 'h-3' }}
          size="xs"
          orientation="vertical"
          label="Loss"
          value={formatWithCurrency(budget.balance.loss, budget.balance.currency)}
        />
      </div>
    </div>
  )
}

export default BudgetPreview
