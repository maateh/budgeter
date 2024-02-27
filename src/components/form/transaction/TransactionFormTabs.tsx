import { UUID } from "crypto"

// icons
import { AlarmClock, Receipt } from "lucide-react"

// components
import TabsSwitcher from "@/components/ui/custom/TabsSwitcher"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// types
import { Transaction } from "@/services/api/types"

type TransactionFormTabsProps = {
  budgetId?: UUID
}

const TransactionFormTabs = ({ budgetId }: TransactionFormTabsProps) => {
  return (
    <TabsSwitcher<Transaction['type']>
      label="Select the type of transaction"
      defaultValue="default"
      tabItems={[
        { value: 'default', Icon: Receipt, content: (
          <TransactionForm budgetId={budgetId} type="default" />
        )},
        { value: 'temporary', Icon: AlarmClock, content: (
          <TransactionForm budgetId={budgetId} type="temporary" />
        )}
      ]}
    />
  )
}

export default TransactionFormTabs
