// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BasicFilter from "./components/BasicFilter"
import AdvancedFilter from "./components/AdvancedFilter"
import TransactionsTable from "./table"

const Transactions = () => {
  return (
    <div className="page-wrapper">
      <h1>Manage Your <span className="text-yellow-600 dark:text-yellow-300 overline">Transactions</span></h1>

      <Separator className="my-6" />

      <div className="flex flex-col justify-between gap-x-8 gap-y-6 xl:flex-row">
        <div className="h-fit min-w-64 flex flex-wrap justify-around gap-12 xl:flex-col xl:w-2/6 xl:max-w-md max-sm:flex-col">
          <section className="flex-1 sm:min-w-80">
            <BasicFilter />
          </section>

          <section className="flex-1 sm:min-w-80">
            <AdvancedFilter />
          </section>
        </div>

        <section className="flex-1 section-wrapper xl:w-4/6">
          <TransactionsTable />
        </section>
      </div>
    </div>
  )
}

export default Transactions
