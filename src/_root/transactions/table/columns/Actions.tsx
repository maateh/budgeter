// icons
import { BadgeInfo, Trash2 } from "lucide-react"

// components
import DropdownActions from "@/components/ui/custom/DropdownActions"

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
    <DropdownActions
      actions={[
        {
          name: 'Details',
          Icon: BadgeInfo,
          onClick: () => openDialog(`/transactions/details/${transaction.id}`)
        },
        {
          name: 'Delete',
          Icon: Trash2,
          variant: 'destructive',
          onClick: () => openDialog(`/transactions/delete/${transaction.id}`, {}, { transaction })
        }
      ]}
    />
  )
}

export default Actions
