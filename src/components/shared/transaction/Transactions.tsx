import { UUID } from "crypto"
import { useState } from "react"

// icons
import { Plus, Receipt, Handshake, Verified, XCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Switch, SwitchThumb } from "@/components/ui/switch"

// components
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
        <h2 className="pl-2 border-l-4 rounded">
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

      <TabsSwitch<Transaction['type']>
        className="mx-auto"
        tabItems={[
          { value: 'default', Icon: Receipt },
          { value: 'borrow', Icon: Handshake }
        ]}
      >
        {(value) => (
          <div className="mt-4 flex flex-col gap-y-2.5">
            <div className="pl-1.5 flex items-center gap-x-2.5 border-l-4 rounded">
              <p className="font-heading tracking-wide">
                {value === 'default' ? 'Processed' : 'Paid Back'}
              </p>
              <Switch className="data-[state=checked]:bg-green-500"
                checked={processed}
                onCheckedChange={() => setProcessed((prev) => !prev)}
                customThumb={
                  <SwitchThumb
                    variant="custom"
                    checked={processed}
                    customIcon={{
                      Checked: Verified,
                      Unchecked: XCircle
                    }}
                  />
                }
              />
            </div>

            <TransactionList
              type={value}
              processed={processed}
              budgetId={budgetId}
            />
          </div>
        )}
      </TabsSwitch>
    </>
  )
}

export default Transactions
