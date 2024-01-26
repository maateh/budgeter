// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetSheet from "@/components/shared/BudgetSheet"

const BudgetSummary = () => {
  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2>Budget <span className="text-green-600 overline">Summary</span></h2>
        <BudgetSheet>
          <Button
            border="md"
            size="lg"
            className="flex items-center gap-x-2"
          >
            <PackagePlus />
            <span>New Budget</span>
          </Button>
        </BudgetSheet>
      </div>
    </>
  )
}

export default BudgetSummary
