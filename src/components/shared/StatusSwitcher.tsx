import { forwardRef } from "react"
// icons
import { CheckCircle2, Loader } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// types
import Transaction from "@/models/Transaction"

type StatusSwitcherProps = {
  status: Transaction['status']
  setStatus?: React.Dispatch<React.SetStateAction<Transaction['status']>>
}

const StatusSwitcher = forwardRef<HTMLButtonElement, StatusSwitcherProps>(({ status, setStatus, ...props }, ref) => {
  const handleStatusChange = () => {
    if (!setStatus) return

    setStatus((prevStatus) => prevStatus === 'processed'
      ? 'processing'
      : 'processed')
  }

  return (
    <Button
      variant="ghost" 
      size="icon-md"
      className="hover:bg-foreground/5"
      onClick={handleStatusChange}
      ref={ref}
      {...props}
    >
      {status === 'processing' ? (
        <Loader
          strokeWidth={3}
          className="text-red-500"
        />
      ) : (
        <CheckCircle2
          strokeWidth={3}
          className="text-green-600 dark:text-green-500"
        />
      )}
    </Button>
  )
})

export default StatusSwitcher
