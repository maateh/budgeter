// components
import { RecentTransactions, BudgetSummary, AvailableBudgets } from "./components"

const Home = () => {
  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-accent">Dashboard</span></h1>

      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4">
        <div className="w-full lg:max-w-xl lg:flex-1 flex flex-col md:flex-row lg:flex-col gap-4">
          <section className="min-h-72 md:flex-1 lg:flex-none layout-rounded bg-primary">
            <BudgetSummary />
          </section>
          <section className="min-h-80 md:flex-1 lg:flex-none layout-rounded bg-primary">
            <RecentTransactions />
          </section>
        </div>

        <section className="w-full lg:w-fit lg:max-w-5xl layout-rounded bg-primary">
          <AvailableBudgets />
        </section>
      </div>
    </div>
  )
}

export default Home
