import { useState } from "react"

// shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// components
import BudgetForm from "../form/BudgetForm"

type BudgetSheetProps = {
  children: React.JSX.Element
}

const BudgetSheet = ({ children }: BudgetSheetProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
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

export default BudgetSheet
