import { forwardRef } from "react"

// icons
import { CheckCircle2, Loader } from "lucide-react"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// types
import { Transaction } from "@/services/api/types"

type StatusSwitcherProps = {
  status: Transaction['status']
  setStatus?: React.Dispatch<React.SetStateAction<Transaction['status']>>
  tooltip?: string
}

const StatusSwitcher = forwardRef<HTMLButtonElement, StatusSwitcherProps>(({ status, setStatus, tooltip, ...props }, ref) => {
  const handleStatusChange = () => {
    if (!setStatus) return

    setStatus((prevStatus) => prevStatus === 'processed'
      ? 'processing'
      : 'processed')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent className="font-heading font-medium tracking-wide">
          {tooltip ? tooltip : status === 'processed' ? (
            'Click to withdraw'
          ) : (
            'Click for crediting'
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

export default StatusSwitcher
