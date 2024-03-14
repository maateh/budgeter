import { useLocation, useNavigate } from "react-router-dom"

// icons
import { BadgePlus } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// components
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// hooks
import { useBudgetTransactions } from "@/lib/react-query/queries"

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

  const { data: transactions, isLoading: transactionsIsLoading } = useBudgetTransactions(budget.id, {
    params: { offset: 0, limit: 7 },
    filterBy: { processed: true }
  })
  
  const handleTransactionNavigate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    navigate(`/transactions/create/${budget.id}`, {
      state: { background: location }
    })
  }

  return (
    <div className="h-full px-3.5 py-3 flex flex-col justify-between gap-y-2.5 rounded-3xl bg-secondary/55 border cursor-pointer"
      style={{ borderColor: budget.theme }}
      onClick={() => navigate(`/budgets/${budget.id}`)}
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

      <ul className="mb-auto flex flex-wrap items-end gap-x-1 gap-y-1">
        <li><Badge className="cursor-pointer icon-wrapper"
          variant="outline"
          size="xs"
          onClick={handleTransactionNavigate}
        >
          <BadgePlus size={16} />
          <span>New</span>
        </Badge></li>

        {!transactionsIsLoading && transactions ? transactions.map((tr) => (
          <li key={tr.id}>
            <PaymentBadge className="font-semibold"
              size="xs"
              transaction={tr}
              currency={budget.balance.currency}
              iconSize={10}
            />
          </li>
        )) : <>Loading...</>} {/* TODO: skeleton */}

        <li><Badge className="cursor-pointer"
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
