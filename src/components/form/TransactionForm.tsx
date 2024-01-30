import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// api
import API from "@/api"

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// icons
import { Minus, Plus } from "lucide-react"

// types
import Transaction, { TransactionType } from "@/models/Transaction"

// validations
import { TransactionValidation } from "@/lib/validation"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const queryClient = useQueryClient()
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => API.budget.findAll()
  })

  const { mutateAsync: saveTransaction } = useMutation({
    mutationFn: async (transaction: Transaction) => {
      await API.budget.addTransactions(transaction.budgetId, [transaction])
      return await API.transaction.save(transaction)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      budgetId: budgetId,
      id: crypto.randomUUID(),
      type: TransactionType.PLUS,
      amount: 0,
      date: new Date()
    }
  })

  async function onSubmit(values: z.infer<typeof TransactionValidation>) {
    const transaction = new Transaction(values.id, values)
    try {
      await saveTransaction(transaction)

      form.reset()
      form.setValue("id", crypto.randomUUID())
    } catch (err) {
      console.error(err)
    }
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

        <div className="flex items-center gap-x-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <Input type="hidden" {...field} />
                    <Button
                      type="button"
                      variant="icon"
                      size="icon"
                      border="icon"
                      className={field.value === TransactionType.PLUS
                        ? 'bg-green-500/50 hover:bg-green-500/60'
                        : 'bg-red-500/80 hover:bg-red-500/90'
                      }
                      onClick={() => {
                        field.onChange(
                          field.value === TransactionType.PLUS
                            ? TransactionType.MINUS
                            : TransactionType.PLUS
                        )
                      }}
                    >
                      {field.value === TransactionType.PLUS ? (
                        <Plus size={16} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </Button>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
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
        </div>

        <Button type="submit" size="sm">Submit</Button>
      </form>
    </Form>
  )
}

export default TransactionForm
