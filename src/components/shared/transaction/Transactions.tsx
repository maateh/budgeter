import { UUID } from "crypto"
import { useState } from "react"

// icons
import { Plus, Receipt, Handshake, Verified, XCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import StateToggle from "@/components/ui/custom/StateToggle"
import TabsSwitch from "@/components/ui/custom/TabsSwitch"
import TransactionList from "@/components/shared/transaction/TransactionList"
import FormDialog from "@/components/form/FormDialog"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// types
import { Transaction } from "@/services/api/types"

type TransactionsProps = {
  budgetId?: UUID
}

const Transactions = ({ budgetId }: TransactionsProps) => {
  const [processed, setProcessed] = useState<Transaction['processed']>(true)

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

      <StateToggle<'processed', 'unprocessed'>
        status={processed ? 'processed' : 'unprocessed'}
        action={() => setProcessed((prev) => !prev)}
        icon={{
          processed: <Verified className="text-accent" size={24} strokeWidth={3} />,
          unprocessed: <XCircle className="text-destructive" size={24} strokeWidth={3} />
        }}
        tooltip={{
          processed: 'Show unprocessed transactions',
          unprocessed: 'Show processed transactions',
        }}
      />

      <TabsSwitch<Transaction['type']>
        tabItems={[
          { value: 'default', Icon: Receipt },
          { value: 'borrow', Icon: Handshake }
        ]}
      >
        {(value) => (
          <TransactionList
            type={value}
            processed={processed}
            budgetId={budgetId}
          />
        )}
      </TabsSwitch>
    </>
  )
}

export default Transactions
