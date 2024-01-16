import { useState } from "react"

// shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// components
import BudgetForm from "../form/BudgetForm"

const CreateBudgetSheet = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" border="md" size="xl" className="ml-auto">
          New Budget
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Create a Budget</SheetTitle>
        </SheetHeader>

        <BudgetForm cleanForm={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export default CreateBudgetSheet
