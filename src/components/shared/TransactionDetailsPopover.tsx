import { format } from "date-fns"

// icons
import { CalendarCheck, CalendarClock, CalendarPlus, Receipt, Trash2 } from "lucide-react"

// types
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// components
import ConfirmSheet from "@/components/shared/ConfirmSheet"
import StatusSwitcher from "@/components/ui/custom/StatusSwitcher"
import BudgetTypeBadge from "@/components/ui/custom/BudgetTypeBadge"
import TransactionBadge from "@/components/ui/custom/TransactionBadge"

type TransactionDetailsPopoverProps = {
  transaction: Transaction
  budget: Budget
  handleChangeStatus: () => void
  handleDelete: () => void
  children: React.JSX.Element
}

const TransactionDetailsPopover = ({ transaction, budget, handleChangeStatus, handleDelete, children }: TransactionDetailsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="min-w-64 max-w-96 flex justify-between items-center gap-x-4">
          <div className="icon-wrapper">
            <Receipt size={24} strokeWidth={1.5} />
            <p className="text-lg font-heading">{transaction.label}</p>
          </div>

          <ConfirmSheet
            title={transaction.status === 'processed'
                ? `Withdraw "${transaction.label}" transaction`
                : `Confirm "${transaction.label}" transaction crediting`
            }
            message={transaction.status === 'processed'
                ? 'Do you really want to withdraw this transaction?'
                : 'Has the transaction been credited? You can always withdraw this action.'
            }
            variant={transaction.status === 'processed' ? 'confirm-negative': 'confirm-positive' }
            confirm={handleChangeStatus}
          >
            <StatusSwitcher status={transaction.status} />
          </ConfirmSheet>
        </div>

        <Separator className="mt-1.5 h-0.5 rounded-full bg-foreground/80" />

        <div className="mt-2.5 flex flex-col gap-y-0.5">
          {transaction.status === 'processed' && transaction.date.crediting && (
            <div className="w-full flex justify-between items-center">
              <p className="text-md font-semibold small-caps">Credited</p>
              <div className="icon-wrapper">
                <p className="text-sm italic font-medium">{format(transaction.date.crediting, 'PPP')}</p>
                <CalendarCheck size={18} strokeWidth={1.7} />
              </div>
            </div>
          )}

          {transaction.status === 'processing' && (
            <div className="w-full flex justify-between items-center">
              <p className="text-md font-semibold small-caps">Expected</p>
              <div className="icon-wrapper">
                <p className="text-sm italic font-medium">{format(transaction.date.expected, 'PPP')}</p>
                <CalendarClock size={18} strokeWidth={1.7} />
              </div>
            </div>
          )}
          
          <div className="w-full flex justify-between items-center">
            <p className="text-md font-semibold small-caps">Created</p>
            <div className="icon-wrapper">
              <p className="text-sm italic font-medium">{format(transaction.date.creation, 'PPP')}</p>
              <CalendarPlus size={18} strokeWidth={1.7} />
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center gap-x-4">
            <div className="max-w-64 icon-wrapper">
              <BudgetTypeBadge
                budget={budget}
                iconSize={14}
                size="icon-sm"
              />
              <p className="text-xl font-heading font-semibold all-small-caps text-ellipsis">{budget.name}</p>
            </div>

            <div className="flex gap-x-3 items-center">
              <TransactionBadge transaction={transaction} size="md" />
              <ConfirmSheet
                title={`Delete "${transaction.label}" Transaction`}
                message="Do you really want to delete this transaction? This action cannot be undone."
                variant="confirm-negative"
                confirm={handleDelete}
              >
                <Button variant="destructive" size="icon-sm">
                  <Trash2 size={16} strokeWidth={2.75} />
                </Button>
              </ConfirmSheet>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TransactionDetailsPopover
