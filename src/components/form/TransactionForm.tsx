import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// models
import Transaction from "@/models/Transaction"

// storage
import Storage from "@/storage"

// context
import useStorage from "@/layouts/_root/context/useStorage"
import { setBudget } from "@/layouts/_root/context/actions"

// validations
import { TransactionValidation } from "@/lib/validation"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const { budgets, dispatch } = useStorage()

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      budgetId: budgetId,
      id: crypto.randomUUID(),
      amount: 0,
      date: new Date()
    }
  })

  async function onSubmit(values: z.infer<typeof TransactionValidation>) {
    const transaction = new Transaction(values.id, values)

    const updatedBudget = await Storage.budget.addTransactions(
      values.budgetId,
      [transaction]
    )
    setBudget(dispatch, updatedBudget)

    form.reset()
    form.setValue("id", crypto.randomUUID())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {!budgetId && (
          <FormField
            control={form.control}
            name="budgetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Budget</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(budgets).map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. $8"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm">Submit</Button>
      </form>
    </Form>
  )
}

export default TransactionForm
