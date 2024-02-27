// components
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetSummary from "./components/BudgetSummary"
import BudgetList from "./components/BudgetList"

// hooks
import { useGetBudgets } from "@/lib/react-query/queries"

const Home = () => {
  const { data: budgets, isLoading: budgetsIsLoading } = useGetBudgets()

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-accent">Dashboard</span></h1>

      <div className="grid gap-8">
        <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
          <section className="w-full layout-rounded bg-primary md:w-4/6 md:max-w-4xl">
            <BudgetSummary />
          </section>
          <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
            <Transactions />
          </section>
        </div>

        <div className="flex flex-col justify-between items-center gap-4 lg:flex-col xl:flex-row">
          {!budgetsIsLoading && budgets ? (
            <>
              <section className="w-full mr-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={budgets.filter(b => b.type === 'income')}
                  type="income"
                />
              </section>
              <section className="w-full ml-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={budgets.filter(b => b.type === 'expense')}
                  type="expense"
                />
              </section>
            </>
          ) : (
            <>Loading...</> // TODO: skeleton
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
