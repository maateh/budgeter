import { useState } from "react"

// shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type FormDialogProps = {
  title: React.JSX.Element
  form: React.JSX.Element
  children: React.JSX.Element
}

const FormDialog = ({ title, form, children }: FormDialogProps) => {
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

        {form}
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog
