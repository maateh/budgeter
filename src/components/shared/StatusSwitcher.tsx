// icons
import { CheckCircle2, Loader } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type StatusSwitcherProps = {
  status: "processing" | "processed"
  setStatus: React.Dispatch<React.SetStateAction<"processing" | "processed">>
  customHandler?: () => void
}

const StatusSwitcher = ({ status, setStatus, customHandler }: StatusSwitcherProps) => {
  const handleStatusChanger = () => {
    setStatus((prevStatus) => prevStatus === 'processed'
      ? 'processing'
      : 'processed')
  }

  return (
    <Button
      onClick={customHandler || handleStatusChanger}
      variant="ghost" 
      size="icon-md"
      className="hover:bg-foreground/5"
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
}

export default StatusSwitcher
