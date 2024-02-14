// icons
import { AlarmClock, ArrowLeftRight, Receipt } from "lucide-react"

// shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// components
import TransactionForm from "@/components/form/transaction/TransactionForm"

type TransactionFormTabsProps = {
  budgetId?: string
}

const TransactionFormTabs = ({ budgetId }: TransactionFormTabsProps) => {
  return (
    <Tabs defaultValue="default">
      <p className="mb-1.5 text-center text-lg font-heading font-medium">
        Select the type of transaction
      </p>
      
      <TabsList className="mx-auto">
        <TabsTrigger value="default" className="icon-wrapper">
          <Receipt />
          <p className="font-heading small-caps">Default</p>
        </TabsTrigger>
        <TabsTrigger value="transferring" className="icon-wrapper">
          <ArrowLeftRight />
          <p className="font-heading small-caps">Transferring</p>
        </TabsTrigger>
        <TabsTrigger value="temporary" className="icon-wrapper">
          <AlarmClock />
          <p className="font-heading small-caps">Temporary</p>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="default">
        <TransactionForm budgetId={budgetId} />
      </TabsContent>

      <TabsContent value="transferring">
        {/* TODO: create custom form */}
        {/* <TransactionForm budgetId={budgetId} /> */}
      </TabsContent>

      <TabsContent value="temporary">
        {/* TODO: create custom form */}
        {/* <TransactionForm budgetId={budgetId} /> */}
      </TabsContent>
    </Tabs>
  )
}

export default TransactionFormTabs
