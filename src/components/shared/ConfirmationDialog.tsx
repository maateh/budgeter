import { useState } from "react"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type ConfirmationDialogProps = {
  title: string
  message: string
  // variant: DialogContentProps['variant'] // TODO: create dialog variants
  confirm: () => void
  children: React.JSX.Element
}

const ConfirmationDialog = ({ title, message, variant, confirm, children }: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      {/* TODO: create dialog variants */}
      <DialogContent /*variant={variant}*/>
        <DialogHeader>
          <DialogTitle className="text-xl capitalize">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription className="text-base font-semibold break-words whitespace-break-spaces overflow-clip">
          {message}
        </DialogDescription>

        <DialogFooter className="flex flex-row flex-wrap justify-end items-center gap-x-4 gap-y-2">
          <Button size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="destructive" border="md" onClick={confirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
