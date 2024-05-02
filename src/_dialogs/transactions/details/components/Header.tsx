// icons
import { Handshake, Receipt } from "lucide-react"

// shadcn
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import BudgetMarker from "@/components/shared/budget/ui/BudgetMarker"

// types
import { Budget, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type TransactionDetailsHeaderProps = {
  transaction: Transaction & { budget: Budget }
}

const TransactionDetailsHeader = ({ transaction }: TransactionDetailsHeaderProps) => {
  return (
    <DialogHeader className="mx-1.5 flex flex-wrap flex-row justify-between items-center gap-4 max-sm:mt-5">
      <DialogTitle className="break-all icon-wrapper">
        {transaction.type === 'default' ? (
          <Receipt size={26} strokeWidth={1.85} />
        ) : (
          <Handshake size={26} strokeWidth={1.85} />
        )}
        <span className="tracking-wide">{transaction.name}</span>
      </DialogTitle>

      <InfoBadge className="ml-auto flex-none w-fit px-5 py-2"
        separatorProps={{ className: "h-4" }}
        orientation="vertical"
        size="sm"
        label={transaction.budget.name}
        value={formatWithCurrency(transaction.budget.balance.current, transaction.budget.balance.currency)}
        icon={<BudgetMarker budget={transaction.budget} />}
        style={{ borderColor: transaction.budget.theme }}
      />
    </DialogHeader>
  )
}

export default TransactionDetailsHeader
