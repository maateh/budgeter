// components
import CreateBudgetSheet from "@/components/shared/CreateBudgetSheet"

const BudgetSummary = () => {
  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2>Budget <span className="text-green-600 overline">Summary</span></h2>
        <CreateBudgetSheet />
      </div>
    </>
  )
}

export default BudgetSummary
