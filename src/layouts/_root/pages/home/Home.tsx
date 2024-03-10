// components
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetSummary from "./components/BudgetSummary"

const Home = () => {
  return (
    <div className="page-wrapper">
      <h1 className="ml-6">
        Budgeter <span className="text-accent">Dashboard</span>
      </h1>

      <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
        <div className="flex-1 w-full min-w-64 flex flex-col gap-y-10 md:min-w-80 md:max-w-4xl">
          <section className="w-full layout-rounded bg-primary">
            <BudgetSummary />
          </section>
          
          <section className="w-full">
            {/* <Budgets /> TODO: implement */}
          </section>
        </div>

        <section className="flex-1 w-full h-fit min-w-64 layout-rounded bg-primary md:w-1/3 md:max-w-lg">
          <Transactions />
        </section>
      </div>
    </div>
  )
}

export default Home
