// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

// components
import BudgetSelector from "@/components/ui/custom/BudgetSelector"
import DefaultFields from "./fields/DefaultFields"

// hooks
import { useTransactionForm } from "./TransactionForm.hooks"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const { form, onSubmit } = useTransactionForm(budgetId)
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3.5">

      {!budgetId && (
        <FormField
          control={form.control}
          name="budgetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-heading font-normal normal-case">Select a Budget</FormLabel>
              <FormControl>
                <BudgetSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <DefaultFields control={form.control} watch={form.watch} />

      <Button type="submit" size="sm">Submit</Button>
      </form>
    </Form>
  )
}

export default TransactionForm
