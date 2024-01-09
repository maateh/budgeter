// components
import { RecentTransactions, BudgetSummary, AvailableBudgets } from "./components"

const Home = () => {
  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budgeter <span className="text-primary">Dashboard</span></h1>

      <div className="min-h-[65vh] grid md:grid-cols-5 md:grid-rows-5 gap-4">
        <section className="md:col-span-2 md:row-span-full order-2 md:order-1 layout-rounded bg-secondary">
          <RecentTransactions />
        </section>
        <section className="md:col-span-3 md:row-span-2 order-1 md:order-2 layout-rounded bg-secondary">
          <BudgetSummary />
        </section>
        <section className="md:col-span-3 md:row-span-3 order-3 layout-rounded bg-secondary">
          <AvailableBudgets />
        </section>
      </div>
    </div>
  )
}

export default Home
