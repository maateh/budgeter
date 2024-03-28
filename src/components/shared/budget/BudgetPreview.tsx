import { useNavigate } from "react-router-dom"

// icons
import { BadgePlus } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import PaymentList from "@/components/shared/transaction/PaymentList"

// hooks
import { useBudgetTransactions } from "@/lib/react-query/queries"

// hooks
import { useDialog } from "@/hooks"

// types
import { Budget } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type BudgetPreviewProps = {
  budget: Budget
}

const BudgetPreview = ({ budget }: BudgetPreviewProps) => {
  const navigate = useNavigate()
  const { openDialog } = useDialog()

  const { data: transactions, isLoading: transactionsIsLoading } = useBudgetTransactions(budget.id, {
    params: { offset: 0, limit: 7 },
    filterBy: { processed: true }
  })
  
  const handleTransactionNavigate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    openDialog(`/transactions/create/${budget.id}`)
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

      {!transactionsIsLoading && transactions ? (
        <PaymentList className="mb-auto"
          payments={transactions.map((tr) => tr.payment)}
          infoBadgeProps={{ size: "xs" }}
          firstElement={(
            <Badge className="flex items-center gap-x-1 cursor-pointer"
              variant="outline"
              size="xs"
              onClick={handleTransactionNavigate}
            >
              <BadgePlus size={16} />
              <span className="font-bold">New</span>
            </Badge>
          )}
          lastElement={transactions.length ? (
            <Badge className="font-semibold cursor-pointer"
              variant="outline"
              size="xs"
            >
              View all
            </Badge>
          ) : undefined}
        >
          {(payment) => (
            <PaymentBadge className="font-semibold border dark:bg-secondary/35"
              size="xs"
              payment={payment}
              processed={true}
              currency={budget.balance.currency}
            />
          )}
        </PaymentList>
      ) : (
        <>Loading...</> // TODO: skeleton
      )}

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
