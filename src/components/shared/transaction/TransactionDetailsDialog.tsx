// icons
import { Handshake, Calendar, Receipt, CalendarCheck } from "lucide-react"

// shadcn
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import BudgetMarker from "@/components/shared/budget/BudgetMarker"
import PaymentBadge from "@/components/shared/transaction/PaymentBadge"
import TransactionStatusSwitch from "@/components/shared/transaction/TransactionStatusSwitch"
import TransactionDeletion from "@/components/shared/transaction/TransactionDeletion"

// types
import { Budget, Transaction } from "@/services/api/types"

// utils
import { format } from "date-fns"
import { formatWithCurrency } from "@/utils"

type TransactionDetailsDialogProps = React.PropsWithChildren & {
  transaction: Transaction
  budget: Budget
}

const TransactionDetailsDialog = ({ transaction, budget, children }: TransactionDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mx-1.5 flex flex-wrap flex-row justify-between items-center gap-4 max-sm:mt-5">
          <DialogTitle className="break-all icon-wrapper">
            {transaction.type === 'default' ? (
              <Receipt size={26} strokeWidth={1.85} />
            ) : (
              <Handshake size={26} strokeWidth={1.85} />
            )}
            <span className="tracking-wide">{transaction.name}</span>
          </DialogTitle>

          <InfoBadge className="flex-none w-fit px-5 py-2"
            label={budget.name}
            value={formatWithCurrency(budget.balance.current, budget.balance.currency)}
            icon={<BudgetMarker budget={budget} />}
            style={{ borderColor: budget.theme.background }}
          />
        </DialogHeader>

        <Separator />

        <div className="text-lg font-heading icon-wrapper justify-center">
          <TransactionStatusSwitch transaction={transaction} />
          {transaction.processed ? (
            <p>This transaction is <span className="text-accent overline">processed</span>.</p>
          ) : (
            <p>This transaction <span className="text-destructive overline">hasn't been processed</span> yet.</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-y-2 text-sm font-heading">
          <div className="icon-wrapper">
            <Calendar size={18} strokeWidth={2.5} className="text-muted-foreground/80" />
            <p>
              Created at
              <span className="px-1 text-foreground/40">»</span>
              <span className="pl-1 text-muted-foreground/80 font-medium">
                {format(transaction.createdAt, 'yyyy. MM. dd. ppp')}
              </span>
            </p>
          </div>

          {transaction.processedAt && (
            <div className="icon-wrapper">
              <CalendarCheck size={20} strokeWidth={2.5} className="text-accent" />
              <p>
                Processed at
                <span className="px-1 text-foreground/35">»</span>
                <span className="pl-1 text-accent font-medium">
                  {format(transaction.processedAt, 'yyyy. MM. dd. ppp')}
                </span>
              </p>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex flex-wrap flex-row justify-between items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-x-2.5">
            <TransactionStatusSwitch transaction={transaction} />
            <PaymentBadge
              transaction={transaction}
              currency={budget.balance.currency}
              size="lg"
            />
          </div>

          <TransactionDeletion transaction={transaction} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDetailsDialog
