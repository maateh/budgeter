import { useState } from "react"

// shadcn
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogContentProps, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

type ConfirmationDialogProps = React.PropsWithChildren & {
  title: string
  description: string
  variant: AlertDialogContentProps['variant']
  action: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const ConfirmationDialog = ({ title, description, variant, action, children }: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent variant={variant}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <Separator />
          <AlertDialogDescription className="break-all whitespace-break-spaces overflow-clip">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={action}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationDialog
