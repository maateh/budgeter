import { UUID } from "crypto"

// icons
import { Plus, AlarmClock, ArrowLeftRight, Receipt } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TabsSwitcher from "@/components/ui/custom/TabsSwitcher"
import TransactionFormTabs from "@/components/form/transaction/TransactionFormTabs"
import FormDialog from "@/components/ui/custom/FormDialog"
import TransactionList from "@/components/shared/transaction/TransactionList"

// types
import { Transaction } from "@/services/api/types"

type TransactionLayoutProps = {
  budgetId?: UUID
}

// TODO: rename this component
const TransactionLayout = ({ budgetId }: TransactionLayoutProps) => {
  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <h2>Recent <span className="text-yellow-300 overline">Transactions</span></h2>
        <FormDialog
          title={<>Add <span className="text-yellow-400 overline">Transaction</span></>}
          formLayout={<TransactionFormTabs budgetId={budgetId} />}
        >
          <Button variant="icon" size="icon">
            <Plus />
          </Button>
        </FormDialog>
      </div>

      <TabsSwitcher<Transaction['type']>
        defaultValue="default"  
        tabItems={[
          {
            value: 'default',
            Icon: Receipt,
            content: <TransactionList type="default" />
          },
          {
            value: 'temporary',
            Icon: AlarmClock,
            content: <TransactionList type="temporary" />
          },
          {
            value: 'transferring',
            Icon: ArrowLeftRight,
            content: <TransactionList type="transferring" />
          },
        ]}
      />
    </>
  )
}

export default TransactionLayout
