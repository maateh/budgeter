// types
import { BudgetType } from "@/models/Budget"

// components
import TransactionList from "@/components/shared/TransactionList"
import BudgetSummary from "./components/BudgetSummary"
import BudgetList from "./components/BudgetList"

// hooks
import { useLoadBudgetsQuery, useLoadTransactionsQuery } from "@/hooks/queries"

const Home = () => {
  const { data: budgets, isLoading: budgetsIsLoading } = useLoadBudgetsQuery()
  const { data: transactions, isLoading: transactionsIsLoading } = useLoadTransactionsQuery()

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-accent">Dashboard</span></h1>

      <div className="grid gap-8">
        <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
          <section className="w-full layout-rounded bg-primary md:w-4/6 md:max-w-4xl">
            <BudgetSummary />
          </section>
          <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
            {!transactionsIsLoading && transactions && budgets ? (
              <TransactionList
                transactions={Object.values(transactions)}
                budgets={budgets}
                startingQuantity={7}
              />
            ) : (
              <>Loading...</> // TODO: skeleton
            )}
          </section>
        </div>

        <div className="flex flex-col justify-between items-center gap-4 lg:flex-col xl:flex-row">
          {!budgetsIsLoading && budgets ? (
            <>
              <section className="w-full mr-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={
                    Object.values(budgets)
                      .filter(b => b.type === BudgetType.INCOME)
                  }
                  type={BudgetType.INCOME}
                />
              </section>
              <section className="w-full ml-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={
                    Object.values(budgets)
                      .filter(b => b.type === BudgetType.EXPENSE)
                  }
                  type={BudgetType.EXPENSE}
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
