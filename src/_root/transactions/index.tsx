// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { RangeFilter, BasicFilter } from "./filter"
import TransactionsTable from "./table"

const Transactions = () => {
  return (
    <div className="page-wrapper">
      <h1>
        Manage Your <span className="text-yellow-600 dark:text-yellow-300 overline">Transactions</span>
      </h1>

      <Separator className="my-6" />

      <div className="flex flex-col justify-between gap-x-8 gap-y-6 xl:flex-row">
        <section className="h-fit min-w-60 flex flex-wrap justify-around gap-12 xl:flex-col xl:w-2/6 xl:max-w-md max-sm:flex-col">
          <div className="flex-1 w-full mx-auto max-w-lg sm:min-w-80">
            <BasicFilter />
          </div>

          <div className="flex-1 w-full mx-auto max-w-lg sm:min-w-80">
            <RangeFilter />
          </div>
        </section>

        <section className="flex-1 section-wrapper xl:w-4/6">
          <TransactionsTable />
        </section>
      </div>
    </div>
  )
}

export default Transactions
