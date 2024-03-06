import { useNavigate } from "react-router-dom"

// shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// providers
import FormProvider from "@/services/providers/form/FormProvider"

type FormDialogProps = {
  title: React.ReactNode
} & React.PropsWithChildren

const FormDialog = ({ title, children }: FormDialogProps) => {
  const navigate = useNavigate()

  return (
    <Dialog onOpenChange={() => navigate(-1)} defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <FormProvider cleanForm={() => navigate(-1)}>
          {children}
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog
