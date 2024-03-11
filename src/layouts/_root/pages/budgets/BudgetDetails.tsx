import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// components
import BudgetNotes from "@/components/shared/budget-note/BudgetNotes"
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetSummary from "./components/BudgetSummary"

// hooks
import { useGetBudget } from "@/lib/react-query/queries"

const BudgetDetails = () => {
  const { id } = useParams() as { id: UUID }

  const { data: budget, isLoading } = useGetBudget(id)

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">
        Budget <span className="text-green-600/85 dark:text-green-400">Details</span>
      </h1>
      
      {!isLoading && budget ? (
        <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
          <div className="flex-1 w-full min-w-64 flex flex-col gap-y-10 md:min-w-80 md:max-w-4xl">
            <section className="w-full">
              <BudgetSummary budget={budget} />
            </section>
  
            <section className="w-full h-fit bg-primary rounded-[2rem] section-wrapper">
              <BudgetNotes budget={budget} />
            </section>
          </div>
  
          <section className="flex-1 w-full h-fit min-w-64 bg-primary rounded-[2rem] section-wrapper md:w-1/3 md:max-w-lg">
            <Transactions budgetId={budget.id} />
          </section>
        </div>
      ) : <>Loading...</>} {/* // TODO: skeleton */}
    </div>
  )
}

export default BudgetDetails
