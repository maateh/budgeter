import { useNavigate, useParams } from "react-router-dom"

// icons
import { Archive } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { BalanceSummary, BalanceSummarySkeleton } from "@/components/shared/budget/BalanceSummary"
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetHeader from "./header"
import BudgetPayments from "./payments"
import BudgetNotes from "./notes"

// hooks
import { useBudget } from "@/lib/react-query/queries"

const BudgetDetails = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id)

  return (
    <div className="page-wrapper">
      <div className="flex flex-wrap-reverse items-center justify-between gap-x-12">
        <h1>
          Budget <span className="text-emerald-600 dark:text-emerald-400">Details</span>
        </h1>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          onClick={() => navigate(`/backup/${id}`)}
        >
          <Archive className="size-5" />
          Manage Backups
        </Button>
      </div>
      
      <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
        <div className="flex-1 w-full min-w-60 flex flex-col gap-y-2.5 md:min-w-80 md:max-w-4xl">
          <section className="w-full section-wrapper">
            <BudgetHeader />

            <Separator className="w-5/6 mx-auto my-5" />

            {!isBudgetLoading && budget ? (
              <BalanceSummary balance={budget.balance} />
            ) : (
              <BalanceSummarySkeleton />
            )}
          </section>

          <section className="w-full section-wrapper">
            <BudgetPayments />
          </section>

          <Separator className="w-11/12 mx-auto my-4" />

          <section className="w-full section-wrapper">
            <BudgetNotes />
          </section>
        </div>
    
        <section className="flex-1 w-full min-w-60 md:w-1/3 md:max-w-lg">
          <Transactions budgetId={id} />
        </section>
      </div>
    </div>
  )
}

export default BudgetDetails
