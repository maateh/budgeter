import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// components
import BudgetNotes from "@/components/shared/budget-note/BudgetNotes"
import TransactionLayout from "@/components/shared/transaction/TransactionLayout"
import BudgetSummary from "./components/BudgetSummary"

// hooks
import { useGetBudget } from "@/lib/react-query/queries"

const BudgetDetails = () => {
  const { id } = useParams() as { id: UUID }
  const { data: budget, isLoading } = useGetBudget(id)

  return !isLoading && budget ? (
    <div className="page-wrapper">
      <h1 className="ml-6">Budget <span className="text-green-400">Details</span></h1>
      
      <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
        <div className="w-full flex flex-col gap-4 md:w-4/6 md:max-w-4xl">
          <section className="w-full h-fit layout-rounded bg-primary">
            <BudgetSummary budget={budget} />
          </section>

          <section className="w-full h-fit layout-rounded bg-primary">
            <BudgetNotes budget={budget} />
          </section>
        </div>

        <section className="w-full h-fit min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
          {/* <TransactionLayout budgetId={budget.id} /> */}
        </section>
      </div>
    </div>
  ) : (
    <>Loading</> // TODO: skeleton
  )
}

export default BudgetDetails
