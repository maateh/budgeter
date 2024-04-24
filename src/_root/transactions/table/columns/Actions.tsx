// icons
import { BadgeInfo, MoreHorizontal, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// hooks
import { useDialog } from "@/hooks"

// types
import { Budget, Transaction } from "@/services/api/types"

type ActionsProps = {
  transaction: Transaction & { budget: Budget }
}

const Actions = ({ transaction }: ActionsProps) => {
  const { openDialog } = useDialog()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0"
          variant="ghost"
          size="sm"
        >
          <span className="sr-only">Open actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-0.5" align="end">
        <DropdownMenuLabel className="text-base font-heading small-caps">
          Actions
        </DropdownMenuLabel>

        <DropdownMenuItem className="icon-wrapper hover:cursor-pointer"
          onClick={() => openDialog(`/transactions/details/${transaction.id}`)}
        >
          <BadgeInfo size={14} strokeWidth={3} />
          <span>Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-destructive font-bold icon-wrapper hover:cursor-pointer focus:bg-destructive"
          onClick={() => openDialog(`/transactions/delete/${transaction.id}`)}
        >
          <Trash2 size={14} strokeWidth={3} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Actions
