import { useLoaderData } from "react-router-dom"

// icons
import { Pencil, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionList from "@/components/shared/RecentTransactions"
import CreateBudgetSheet from "@/components/shared/BudgetSheet"

// types
import Budget from "@/models/Budget"

type BudgetDetailsLoaderData = {
  budget: Budget
}

const BudgetDetails = () => {
  const { budget } = useLoaderData() as BudgetDetailsLoaderData

  return (
    <div className="page-wrapper">
      <h1 className="ml-6">Budget <span className="text-green-400">Details</span></h1>
      
      <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
        <section className="w-full h-fit min-h-96 layout-rounded bg-primary md:w-4/6 md:max-w-5xl">
          <div className="flex justify-between items-center">
            <h2
              className="px-12 py-4 overline rounded-full"
              style={{
                backgroundColor: budget.theme.background,
                color: budget.theme.foreground
              }}
            >
              {budget.name}
            </h2>

            <div className="flex justify-center items-center gap-x-4 gap-y">
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-x-1.5 "
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </Button>

              <CreateBudgetSheet type="edit" budget={budget}>
                <Button
                  variant="default"
                  border="md"
                  size="lg"
                  className="flex items-center gap-x-2"
                >
                  <Pencil size={18} />
                  <span>Edit</span>
                </Button>
              </CreateBudgetSheet>
            </div>
          </div>
        </section>

        <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
          <TransactionList
            transactions={Object.values(budget.transactions)}
            startingQuantity={6}
            loadingQuantity={4}
            budget={budget}
          />
        </section>
      </div>
    </div>
  )
}

export default BudgetDetails
