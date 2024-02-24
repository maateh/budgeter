// icons
import { AlarmClock, ArrowLeftRight, Receipt } from "lucide-react"

// components
import TabsSwitcher from "@/components/ui/custom/TabsSwitcher"
import Form from "@/components/form/Form"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// hooks
import { useTransactionSubmit, useTransferringTransactionSubmit, useTemporaryTransactionSubmit, useDefaultValues } from "@/components/form/transaction/hooks"

// types
import { FieldValue } from "@/components/form/transaction/types"
import { Transaction } from "@/services/api/types"

// validations
import { TemporaryTransactionValidation, TransactionValidation, TransferringTransactionValidation } from "@/lib/validation"

type TransactionFormTabsProps = {
  budgetId?: string
}

const TransactionFormTabs = ({ budgetId }: TransactionFormTabsProps) => {
  const { defaultValues } = useDefaultValues(budgetId)

  return (
    <TabsSwitcher<Transaction['type']>
      label="Select the type of transaction"
      defaultValue="default"
      tabItems={[
        { value: 'default', Icon: Receipt, content: (
          <Form<FieldValue['default'], typeof TransactionValidation>
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
        )},
        { value: 'temporary', Icon: AlarmClock, content: (
          <Form<FieldValue['temporary'], typeof TemporaryTransactionValidation>
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
        )},
        { value: 'transferring', Icon: ArrowLeftRight, content: (
          <Form<FieldValue['transferring'], typeof TransferringTransactionValidation>
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
        )},
      ]}
    />
  )
}

export default TransactionFormTabs
