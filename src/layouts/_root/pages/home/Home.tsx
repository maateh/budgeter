// types
import { BudgetType } from "@/models/Budget"

// components
import RecentTransactions from "@/components/shared/RecentTransactions"
import BudgetSummary from "./components/BudgetSummary"
import BudgetList from "./components/BudgetList"

// hooks
import { useDashboardQuery } from "./Home.hooks"

const Home = () => {
  const [_budgets, _transactions] = useDashboardQuery()

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-accent">Dashboard</span></h1>

      <div className="grid gap-8">
        <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
          <section className="w-full layout-rounded bg-primary md:w-4/6 md:max-w-4xl">
            <BudgetSummary />
          </section>
          <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
            {!_transactions.isLoading && _transactions.data && _budgets.data ? (
              <RecentTransactions
                transactions={Object.values(_transactions.data)}
                budgets={_budgets.data}
                startingQuantity={7}
              />
            ) : (
              <>Loading...</> // TODO: skeleton
            )}
          </section>
        </div>

        <div className="flex flex-col justify-between items-center gap-4 lg:flex-col xl:flex-row">
          {!_budgets.isLoading && _budgets.data ? (
            <>
              <section className="w-full mr-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={
                    Object.values(_budgets.data)
                      .filter(b => b.type === BudgetType.INCOME)
                  }
                  type={BudgetType.INCOME}
                />
              </section>
              <section className="w-full ml-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
                <BudgetList
                  budgets={
                    Object.values(_budgets.data)
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
