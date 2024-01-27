import { useState } from "react"

// shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

type ConfirmSheetProps = {
  title: string
  message: string
  confirm: () => void
  children: React.JSX.Element
}

const ConfirmSheet = ({ title, message, confirm, children }: ConfirmSheetProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="capitalize">{title}</SheetTitle>
        </SheetHeader>

        <SheetDescription className="text-base font-medium">
          {message}
        </SheetDescription>

        <SheetFooter className="flex flex-row flex-wrap justify-end items-center gap-x-4 gap-y-2">
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={confirm}>
            Confirm
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ConfirmSheet
