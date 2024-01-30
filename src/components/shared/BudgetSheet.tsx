import { useState } from "react"

// shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// components
import BudgetForm from "@/components/form/budget/BudgetForm"

// types
import Budget from "@/models/Budget"

type BudgetSheetProps = {
  type?: "create" | "edit"
  budget?: Budget
  children: React.JSX.Element
}

const BudgetSheet = ({ type = "create", budget, children }: BudgetSheetProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle className="capitalize">{type} Budget</SheetTitle>
        </SheetHeader>

        <BudgetForm
          type={type}
          budget={budget}
          cleanForm={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

export default BudgetSheet
