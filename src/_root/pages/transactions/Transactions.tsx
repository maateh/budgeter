// shadcn
import { Separator } from "@/components/ui/separator"

// components
import TransactionsTable from "./components/TransactionsTable"
import TransactionsFilter from "./components/TransactionsFilter"

const Transactions = () => {
  return (
    <div className="page-wrapper">
      <h1>Manage Your <span className="text-yellow-600 dark:text-yellow-300 overline">Transactions</span></h1>

      <Separator className="my-6" />

      <div className="flex flex-col justify-between gap-x-8 gap-y-6 md:flex-row">
        <section className="min-w-56 md:w-2/5 md:min-w-72 md:max-w-lg">
          <TransactionsFilter />
        </section>

        <section className="flex-1 section-wrapper md:w-3/5">
          <TransactionsTable />
        </section>
      </div>
    </div>
  )
}

export default Transactions
