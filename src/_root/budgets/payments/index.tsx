// icons
import { BadgeInfo, BadgePlus, ChevronRightCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// components
import Listing from "@/components/ui/custom/Listing"
import PaymentBadge from "@/components/shared/payment/custom/PaymentBadge"

// hooks
import { useDialog, usePagination } from "@/hooks"
import { usePaymentsPagination } from "@/lib/react-query/queries"

// types
import { Budget } from "@/services/api/types"

type BudgetPaymentsProps = {
  budget: Budget
}

const BudgetPayments = ({ budget }: BudgetPaymentsProps) => {
  const { openDialog } = useDialog()

  const { data, isLoading, hasNextPage, fetchNextPage } = usePaymentsPagination({
    params: { offset: 0, limit: 15 },
    filter: { filterBy: { budgetId: budget.id }},
    sortBy: { createdAt: -1 }
  })

  const { manualPagination } = usePagination({ data, fetchNextPage, disableScrolling: true })

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="border-amber-600 dark:border-amber-500 indent-border">
        Recent <span className="text-amber-600 dark:text-amber-500 overline">Payments</span>
      </h2>

      {!isLoading && data ? (
        <Listing className="mx-2.5 flex flex-wrap flex-row justify-center items-center gap-1.5"
          pages={data.pages}
          fallbackProps={{ value: 'No payments to show.' }}
          firstElement={(
            <Button className="h-fit px-5 py-1 icon-wrapper"
              variant="outline"
              size="sm"
              onClick={() => openDialog(`/transactions/create/${budget.id}`)}
            >
              <BadgePlus size={20} />
              New
            </Button>
          )}
          lastElement={hasNextPage ? (
            <Button className="h-fit px-5 py-1 icon-wrapper"
              variant="outline"
              size="sm"
              onClick={manualPagination}
            >
              Load more
              <ChevronRightCircle size={20} />
            </Button>
          ) : undefined}
        >
          {(payment) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PaymentBadge className="bg-primary/35 py-0.5 border-2 cursor-pointer"
                    payment={payment}
                    currency={budget.balance.currency}
                    processed
                    size="default"
                    onClick={() => openDialog(`/transactions/details/${payment.transactionId}`)}
                  />
                </TooltipTrigger>
                <TooltipContent className="font-heading icon-wrapper">
                  <BadgeInfo size={18} strokeWidth={2.5} />
                  Show details
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Listing>
      ) : (
        <>Loading...</> // TODO: skeleton
      )}
    </div>
  )
}

export default BudgetPayments
