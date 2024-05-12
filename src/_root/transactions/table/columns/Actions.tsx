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
        <Button
          variant="ghost"
          size="icon"
        >
          <span className="sr-only">Open actions</span>
          <MoreHorizontal className="size-3.5 sm:size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-0.5" align="end">
        <DropdownMenuLabel className="text-base font-heading small-caps">
          Actions
        </DropdownMenuLabel>

        <DropdownMenuItem className="icon-wrapper hover:cursor-pointer"
          onClick={() => openDialog(`/transactions/details/${transaction.id}`)}
        >
          <BadgeInfo className="size-4" strokeWidth={3} />
          <span>Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-destructive font-bold icon-wrapper hover:cursor-pointer focus:bg-destructive"
          onClick={() => openDialog(`/transactions/delete/${transaction.id}`, {}, { transaction })}
        >
          <Trash2 className="size-4" strokeWidth={3} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Actions
