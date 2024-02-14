// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// components
import DefaultFields from "./fields/DefaultFields"

// hooks
import { useTransactionForm } from "./TransactionForm.hooks"
import { useLoadBudgetsQuery } from "./TransactionForm.queries"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const { form, onSubmit } = useTransactionForm(budgetId)
  const { data: budgets, isLoading } = useLoadBudgetsQuery()
  
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
              <Select
                disabled={!budgets || isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgets && Object.values(budgets).map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
