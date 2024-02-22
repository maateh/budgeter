// components
// import TransactionList from "@/components/shared/TransactionList"
import BudgetSummary from "./components/BudgetSummary"
import BudgetNotes from "./components/BudgetNotes"

// hooks
import { useLoadBudgetQuery } from "@/lib/react-query/queries"

const BudgetDetails = () => {
  const { data: budget, isLoading } = useLoadBudgetQuery()

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
          {/* <TransactionList
            transactions={Object.values(budget.transactions)}
            startingQuantity={6}
            loadingQuantity={4}
            budget={budget}
          /> */}
        </section>
      </div>
    </div>
  ) : (
    <>Loading</> // TODO: skeleton
  )
}

export default BudgetDetails
