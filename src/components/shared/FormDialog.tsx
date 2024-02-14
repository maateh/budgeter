import { useState } from "react"

// shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type FormDialogProps = {
  title: React.JSX.Element
  formLayout: React.JSX.Element
  children: React.JSX.Element
}

const FormDialog = ({ title, formLayout, children }: FormDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        {formLayout}
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog
