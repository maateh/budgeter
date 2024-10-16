import { useState } from "react"

// icons
import { Plus, Receipt, Handshake, Verified, XCircle, Coins } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Switch, SwitchThumb } from "@/components/ui/switch"

// components
import TabsSwitch from "@/components/ui/custom/TabsSwitch"
import TransactionList from "@/components/shared/transaction/TransactionList"
import TransactionPreview from "@/components/shared/transaction/ui/TransactionPreview"

// hooks
import { useDialog } from "@/hooks"

// types
import { BasePayment, Transaction } from "@/services/api/types"

type TransactionsProps = {
  budgetId?: string
}

const Transactions = ({ budgetId }: TransactionsProps) => {
  const [processed, setProcessed] = useState<BasePayment['processed']>(true)

  const { openDialog } = useDialog()

  return (
    <div className="h-fit max-w-xl mx-auto px-6 py-5 bg-primary rounded-[2rem] shadow-border/15 shadow-lg drop-shadow-md">
      <div className="mb-5 flex justify-between items-center gap-x-4">
        <h2 className="border-yellow-600 dark:border-yellow-300 indent-border">
          Recent <span className="text-yellow-600 dark:text-yellow-300 overline">Transactions</span>
        </h2>
        
        <Button
          variant="icon"
          size="icon"
          onClick={() => openDialog(`/transactions/create${budgetId ? `/${budgetId}` : ''}`)}
        >
          <Plus size={20} />
        </Button>
      </div>

      <TabsSwitch<Transaction['type']>
        className="mx-auto"
        tabItems={[
          { value: 'default', Icon: Receipt },
          { value: 'borrow', Icon: Handshake },
          { value: 'transfer', Icon: Coins }
        ]}
      >
        {(type) => (
          <div className="mt-4 flex flex-col gap-y-2.5">
            {type !== 'transfer' && (
              <div className="pl-1.5 flex items-center gap-x-2.5 border-l-4 rounded">
                <p className="font-heading tracking-wide">
                  {type === 'default' ? 'Processed' : 'Paid Back'}
                </p>
                  <Switch className="data-[state=checked]:bg-green-500"
                    checked={processed}
                    onCheckedChange={() => setProcessed((prev) => !prev)}
                    customThumb={
                      <SwitchThumb
                        variant="custom"
                        checked={processed}
                        customIcon={{ Checked: Verified, Unchecked: XCircle }}
                      />
                    }
                  />
              </div>
            )}

            <TransactionList
              filter={{
                filterBy: {
                  budgetId, type,
                  ['payment.processed']: type === 'transfer' || processed,
                }
              }}
              params={{ limit: 5, offset: 0, maxItemLimit: 10 }}
            >
              {(transaction, budget) => (
                <TransactionPreview
                  transaction={transaction}
                  budget={budget}
                  onClick={() => openDialog(`/transactions/details/${transaction.id}`)}
                />
              )}
            </TransactionList>
          </div>
        )}
      </TabsSwitch>
    </div>
  )
}

export default Transactions
