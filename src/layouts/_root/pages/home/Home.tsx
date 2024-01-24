// components
import { RecentTransactions, BudgetSummary, AvailableBudgets } from "./components"

const Home = () => {
  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-accent">Dashboard</span></h1>

      <div className="grid gap-8">
        <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
          <section className="w-full layout-rounded bg-primary md:w-4/6 md:max-w-4xl">
            <BudgetSummary />
          </section>
          <section className="w-full layout-rounded bg-primary md:w-2/6 md:max-w-lg">
            <RecentTransactions />
          </section>
        </div>

        {/* TODO: separate income and expense budgets */}
        <div className="flex flex-col justify-between items-center gap-4 lg:flex-col xl:flex-row">
          <section className="w-full mr-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
            <AvailableBudgets />
          </section>
          <section className="w-full ml-auto layout-rounded bg-primary md:w-5/6 lg:max-w-5xl">
            <AvailableBudgets />
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
