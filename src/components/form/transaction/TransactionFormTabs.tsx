// icons
import { AlarmClock, ArrowLeftRight, Receipt } from "lucide-react"

// shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// components
import Form from "@/components/form/Form"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// hooks
import { useTransactionSubmit, useTransferringTransactionSubmit, useTemporaryTransactionSubmit } from "@/components/form/transaction/hooks"

// types
import { FormFields } from "@/components/form/transaction/types"

// validations
import { TemporaryTransactionValidation, TransactionValidation, TransferringTransactionValidation } from "@/lib/validation"

// constants
import { defaultValues } from "@/components/form/transaction/constants"

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
        <Form<FormFields['default'], typeof TransactionValidation>
          type="create"
          validationSchema={TransactionValidation}
          defaultValues={defaultValues}
          useSubmit={useTransactionSubmit}
        >
          {(form) => (
            <TransactionForm
              type="default"
              budgetId={budgetId}
              form={form}
            />
          )}
        </Form>
      </TabsContent>

      <TabsContent value="transferring">
        <Form<FormFields['transferring'], typeof TransferringTransactionValidation>
          type="create"
          validationSchema={TransferringTransactionValidation}
          defaultValues={defaultValues}
          useSubmit={useTransferringTransactionSubmit}
        >
          {(form) => (
            <TransactionForm
              type="transferring"
              budgetId={budgetId}
              form={form}
            />
          )}
        </Form>
      </TabsContent>
      
      <TabsContent value="temporary">
        <Form<FormFields['temporary'], typeof TemporaryTransactionValidation>
          type="create"
          validationSchema={TemporaryTransactionValidation}
          defaultValues={defaultValues}
          useSubmit={useTemporaryTransactionSubmit}
        >
          {(form) => (
            <TransactionForm
              type="temporary"
              budgetId={budgetId}
              form={form}
            />
          )}
        </Form>
      </TabsContent>
    </Tabs>
  )
}

export default TransactionFormTabs
