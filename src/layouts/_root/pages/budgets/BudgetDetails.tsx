import { useLoaderData } from "react-router-dom"

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
      
      <div className="layout-rounded bg-primary">
        <h2
          className="w-fit px-12 py-4 overline rounded-full"
          style={{
            backgroundColor: budget.theme.background,
            color: budget.theme.foreground
          }}
        >
          {budget.name}
        </h2>
      </div>
    </div>
  )
}

export default BudgetDetails
