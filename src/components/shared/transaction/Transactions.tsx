import { UUID } from "crypto"

// icons
import { Plus, Receipt, Handshake } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TabsSwitcher from "@/components/ui/custom/TabsSwitcher"
import TransactionList from "@/components/shared/transaction/TransactionList"
import FormDialog from "@/components/form/FormDialog"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// types
import { Transaction } from "@/services/api/types"

type TransactionsProps = {
  budgetId?: UUID
}

const Transactions = ({ budgetId }: TransactionsProps) => {
  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <h2>
          Recent <span className="text-yellow-300 overline">Transactions</span>
        </h2>

        <FormDialog
          title={<>Add <span className="text-yellow-400 overline">Transaction</span></>}
          formLayout={<TransactionForm budgetId={budgetId} />}
        >
          <Button variant="icon" size="icon">
            <Plus size={20} />
          </Button>
        </FormDialog>
      </div>

      <TabsSwitcher<Transaction['type']>
        defaultValue="default"  
        tabItems={[
          {
            value: 'default',
            Icon: Receipt,
            content: <TransactionList budgetId={budgetId} type="default" />
          },
          {
            value: 'borrow',
            Icon: Handshake,
            content: <TransactionList budgetId={budgetId} type="borrow" />
          }
        ]}
      />
    </>
  )
}

export default Transactions
