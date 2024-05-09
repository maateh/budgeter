import { useNavigate } from "react-router-dom"

// icons
import { BadgePlus, ChevronRightCircle, HandCoins, Minus, Plus } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SkeletonList } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import Listing from "@/components/ui/custom/Listing"
import BalanceBadge from "@/components/shared/budget/ui/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/ui/BudgetNameBadge"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"

// hooks
import { useDialog } from "@/hooks"
import { useSubpayments } from "@/lib/react-query/queries"

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

  const { data: payments, isLoading: isPaymentsLoading } = useSubpayments({
    params: { offset: 0, limit: 8 },
    filter: { filterBy: { budgetId: budget.id }},
    sortBy: { createdAt: -1 }
  })

  return (
    <div className="h-full px-3.5 py-3 flex flex-col justify-between gap-y-2.5 rounded-3xl bg-secondary/55 border-2 shadow-border/10 shadow-lg drop-shadow-sm cursor-pointer"
      onClick={() => navigate(`/budgets/${budget.id}`)}
    >
      <div className="w-full flex flex-wrap justify-between items-center gap-x-3.5 gap-y-2">
        <BudgetNameBadge className="h-fit text-sm text-center sm:text-md"
          budget={budget}
        />

        <div className="ml-auto flex items-center gap-x-2">
          {budget.balance.borrowment.plus || budget.balance.borrowment.minus ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="ghost" size="icon">
                    <HandCoins size={16} />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="px-4 py-3 space-y-2 text-sm font-heading rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-base indent-border">
                    Money <span className="text-muted-foreground overline">under borrowment</span>
                  </p>

                  <InfoBadge className="w-full px-4 py-1.5 mx-auto"
                    valueProps={{ className: "text-sm" }}
                    separatorProps={{ className: "h-4" }}
                    orientation="vertical"
                    size="sm"
                    variant="accent"
                    label="Borrowments"
                    value={formatWithCurrency(budget.balance.borrowment.plus, budget.balance.currency)}
                    icon={<Plus className="text-accent" size={20} strokeWidth={5} />}
                  />

                  <Separator className="w-2/3 mx-auto" />

                  <InfoBadge className="w-full px-4 py-1.5 mx-auto"
                    valueProps={{ className: "text-sm" }}
                    separatorProps={{ className: "h-4" }}
                    orientation="vertical"
                    size="sm"
                    variant="destructive"
                    label="Borrowments"
                    value={formatWithCurrency(budget.balance.borrowment.minus, budget.balance.currency)}
                    icon={<Minus className="text-destructive" size={20} strokeWidth={5} />}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : <></>}

          <BalanceBadge className="min-w-32 px-3"
            separatorProps={{ className: "h-3" }}
            orientation="vertical"
            size="sm"
            iconSize={18}
            balance={budget.balance}
          />
        </div>
      </div>
      
      <Separator className="mx-auto w-5/6" />

      {!isPaymentsLoading && payments ? (
        <Listing className="mb-auto flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1"
          items={payments}
          fallbackProps={{ size: "xs", value: 'No payments to show.' }}
          firstElement={(
            <Badge className="py-1 px-2.5 flex items-center gap-x-1.5 font-heading font-medium cursor-pointer"
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                openDialog(`/transactions/create/${budget.id}`)
              }}
            >
              <BadgePlus size={16} />
              New
            </Badge>
          )}
          lastElement={payments.length ? (
            <Badge className="py-1 px-2.5 flex items-center gap-x-1.5 font-heading font-medium cursor-pointer"
              variant="outline"
              size="xs"
            >
              View all
              <ChevronRightCircle size={14} />
            </Badge>
          ) : undefined}
        >
          {(payment) => (
            <PaymentBadge className="px-2.5 flex font-semibold bg-background/50 border-2"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                openDialog(`/transactions/details/${payment.transactionId}`)
              }}
              payment={payment}
              currency={budget.balance.currency}
              processed
            />
          )}
        </Listing>
      ) : (
        <SkeletonList className="mb-auto flex flex-row flex-wrap justify-center items-center gap-x-2.5 gap-y-1.5"
          itemProps={{ className: "w-20 h-5" }}
          amount={7}
        />
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
