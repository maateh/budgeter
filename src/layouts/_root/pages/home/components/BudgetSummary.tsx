// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import FormDialog from "@/components/shared/FormDialog"
import BudgetForm from "@/components/form/budget/BudgetForm"

const BudgetSummary = () => {
  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2>Budget <span className="text-green-600 overline">Summary</span></h2>
        <FormDialog
          title={<>Create <span className="text-green-400 overline">Budget</span></>}
          formLayout={<BudgetForm type="create" />}
        >
          <Button
            border="md"
            size="lg"
            className="flex items-center gap-x-2"
          >
            <PackagePlus />
            <span>New Budget</span>
          </Button>
        </FormDialog>
      </div>
    </>
  )
}

export default BudgetSummary
