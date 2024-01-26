import { useLoaderData } from "react-router-dom"

// types
import Budget from "@/models/Budget"
import TransactionList from "@/components/shared/RecentTransactions"

type BudgetDetailsLoaderData = {
  budget: Budget
}

const BudgetDetails = () => {
  const { budget } = useLoaderData() as BudgetDetailsLoaderData

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budget <span className="text-green-400">Details</span></h1>
      
      <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
        <section className="w-full layout-rounded bg-primary md:w-4/6 md:max-w-5xl">
          <h2
            className="w-fit px-12 py-4 overline rounded-full"
            style={{
              backgroundColor: budget.theme.background,
              color: budget.theme.foreground
            }}
          >
            {budget.name}
          </h2>
        </section>

        <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
          <TransactionList
            transactions={Object.values(budget.transactions)}
            startingQuantity={6}
            loadingQuantity={4}
            budget={budget}
          />
        </section>
      </div>
    </div>
  )
}

export default BudgetDetails
