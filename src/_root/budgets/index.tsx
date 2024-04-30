import { useNavigate, useParams } from "react-router-dom"

// icons
import { Archive } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetNotes from "@/components/shared/budget-note/BudgetNotes"
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetSummary from "./summary"
import BudgetPayments from "./payments"

// hooks
import { useBudget } from "@/lib/react-query/queries"
import { Separator } from "@/components/ui/separator"

const BudgetDetails = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()

  const { data: budget, isLoading } = useBudget(id)

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
          <Archive />
          Manage Backups
        </Button>
      </div>
      
      {!isLoading && budget ? (
        <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
          <div className="flex-1 w-full min-w-64 flex flex-col gap-y-2.5 md:min-w-80 md:max-w-4xl">
            <section className="w-full section-wrapper">
              <BudgetSummary budget={budget} />
            </section>

            <section className="w-full section-wrapper">
              <BudgetPayments budget={budget} />
            </section>

            <Separator className="w-11/12 mx-auto my-1.5" />
  
            <section className="w-full bg-primary rounded-[2rem] section-wrapper">
              <BudgetNotes budget={budget} />
            </section>
          </div>
  
          <section className="flex-1 w-full min-w-64 md:w-1/3 md:max-w-lg">
            <Transactions budgetId={budget.id} />
          </section>
        </div>
      ) : <>Loading...</>} {/* // TODO: skeleton */}
    </div>
  )
}

export default BudgetDetails
