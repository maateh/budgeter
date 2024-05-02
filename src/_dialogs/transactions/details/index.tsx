import { useParams } from "react-router-dom"

// icons
import { Receipt, Banknote } from "lucide-react"

// shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import PaymentProgress from "@/components/shared/payment/PaymentProgress"
import RelatedTransactions from "@/components/shared/transaction/RelatedTransactions"
import Header from "./components/Header"
import Info from "./components/Info"
import Footer from "./components/Footer"
import TransactionDetailsSkeleton from "./skeleton"

// hooks
import { useTransactionWithBudget } from "@/lib/react-query/queries"

const TransactionDetails = () => {
  const { id } = useParams() as { id: string }

  const { data: transaction, isLoading } = useTransactionWithBudget(id)

  if (isLoading || !transaction) {
    return <TransactionDetailsSkeleton />
  }

  return (
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <Header transaction={transaction} />

      <Separator />

      <Info transaction={transaction} />

      <Separator />
      
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="icon-wrapper">
              <Receipt />
              <span className="text-base font-normal">Related transactions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="w-5/6 mx-auto">
            <RelatedTransactions
              transaction={transaction}
              budget={transaction.budget}
            />
          </AccordionContent>
        </AccordionItem>

        {transaction.type === 'borrow' && (
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="icon-wrapper">
                <Banknote />
                <span className="text-base font-normal">Subpayments</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mx-3">
              <PaymentProgress
                transactionId={transaction.id}
                budgetId={transaction.budgetId}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Separator />

      <Footer transaction={transaction} />
    </DialogContent>
  )
}

export default TransactionDetails
