import { format } from "date-fns"

// icons
import { Calendar, CalendarCheck, CalendarClock } from "lucide-react"

// components
import TransactionStatusToggle from "@/components/shared/transaction/ui/TransactionStatusToggle"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionDetailsInfoProps = {
  transaction: Transaction & { budget: Budget }
}

const TransactionDetailsInfo = ({ transaction }: TransactionDetailsInfoProps) => {
  return (
    <>
      <div className="justify-center text-lg text-center font-heading icon-wrapper">
        <TransactionStatusToggle transaction={transaction} />

        {transaction.type === 'transfer' ? (
          <p>This is a <span className="text-blue-600 dark:text-blue-400 overline">transfer</span> transaction.</p>
        ) : transaction.payment.processed ? (
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
              {format(transaction.createdAt, 'yyyy. MM. dd. - hh:mm')}
            </span>
          </p>
        </div>

        <div className="icon-wrapper">
          <CalendarClock size={18} strokeWidth={2.5} className="text-muted-foreground/80" />
          <p>
            Last updated at
            <span className="px-1 text-foreground/40">»</span>
            <span className="pl-1 text-muted-foreground/80 font-medium">
              {format(transaction.updatedAt, 'yyyy. MM. dd. - hh:mm')}
            </span>
          </p>
        </div>

        {transaction.payment.processedAt && (
          <div className="icon-wrapper">
            <CalendarCheck size={20} strokeWidth={2.5} className="text-accent" />
            <p>
              Processed at
              <span className="px-1 text-foreground/35">»</span>
              <span className="pl-1 text-accent font-medium">
                {format(transaction.payment.processedAt, 'yyyy. MM. dd. - hh:mm')}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default TransactionDetailsInfo
