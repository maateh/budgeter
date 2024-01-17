import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// validations
import { TransactionValidation } from "@/lib/validation"

type TransactionFormProps = {
  budget?: Budget
}

const TransactionForm = ({ budget }: TransactionFormProps) => {
  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      budgetId: budget?.id,
      id: crypto.randomUUID(),
      amount: 0,
      date: new Date()
    }
  })

  function onSubmit(values: z.infer<typeof TransactionValidation>) {
    const transaction = new Transaction(values.id, values)

    budget?.executeTransactions([transaction])

    form.reset()
    form.setValue("id", crypto.randomUUID())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {!budget && (
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
                    {Budget.findAll().map(b => (
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