import { UUID } from "crypto"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { format } from "date-fns"

// icons
import { Handshake, Calendar, Receipt, CalendarCheck, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import InfoBadge from "@/components/ui/custom/InfoBadge"
import BudgetMarker from "@/components/shared/budget/custom/BudgetMarker"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"

// hooks
import { useTransactionWithBudget } from "@/lib/react-query/queries"

// utils
import { formatWithCurrency } from "@/utils"

const TransactionDetails = () => {
  const { id } = useParams() as { id: UUID }
  const navigate = useNavigate()
  const location = useLocation()

  const { data: transaction, isLoading } = useTransactionWithBudget(id)

  return !isLoading && transaction ? (
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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
          separatorProps={{ className: "h-5" }}
          orientation="vertical"
          label={transaction.budget.name}
          value={formatWithCurrency(transaction.budget.balance.current, transaction.budget.balance.currency)}
          icon={<BudgetMarker budget={transaction.budget} />}
          style={{ borderColor: transaction.budget.theme }}
        />
      </DialogHeader>

      <Separator />

      <div className="justify-center text-lg text-center font-heading icon-wrapper">
        <TransactionStatusToggle transaction={transaction} />
        {transaction.processed ? (
          <p>This transaction is <span className="text-accent overline">processed</span>.</p>
        ) : (
          <p>This transaction <span className="text-destructive overline">hasn't been processed</span> yet.</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-y-2 text-sm text-center font-heading">
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
          <TransactionStatusToggle transaction={transaction} />
          <PaymentBadge
            transaction={transaction}
            currency={transaction.budget.balance.currency}
            size="lg"
          />
        </div>

        <Button className="ml-auto flex items-center gap-x-1.5"
          variant="destructive"
          size="sm"
          onClick={() => navigate(`/transactions/delete/${transaction.id}`, {
            state: { background: location.state.background },
            replace: true
          })}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  ) : <>Loading...</> // TODO: skeleton
}

export default TransactionDetails