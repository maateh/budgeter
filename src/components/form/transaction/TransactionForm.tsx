import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// components
import DateTimePicker from "@/components/shared/DateTimePicker"

// types
import Transaction, { TransactionType } from "@/models/Transaction"

// validations
import { TransactionValidation } from "@/lib/validation"

// hooks
import { useLoadBudgetsQuery, useSaveTransactionMutation } from "./TransactionForm.hooks"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const { data: budgets, isLoading } = useLoadBudgetsQuery()
  const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      budgetId: budgetId,
      label: '',
      type: TransactionType.PLUS,
      amount: 0
    }
  })

  async function onSubmit(values: z.infer<typeof TransactionValidation>) {
    values.date.creation = new Date()

    if (!values.processing) {
      values.date.crediting = values.date.creation
      values.date.expected = values.date.creation
    }

    const id = crypto.randomUUID()
    const transaction = new Transaction(id, values)
    try {
      await saveTransaction(transaction)

      form.reset()
      form.setValue("budgetId", transaction.budgetId)
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

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-heading text-md font-normal small-caps">
                Label
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. Chocolate"
                  className="h-9"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="space-y-0.5">
          <FormLabel className="font-heading text-md font-normal small-caps">
            Under Processing
          </FormLabel>

          <div className="flex items-center gap-x-2">
            <FormField
              control={form.control}
              name="processing"
              render={({ field }) => (
                <FormItem className="grid gap-y-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date.expected"
              render={({ field }) => form.watch('processing') ? (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="Expected Date"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : <></>}
            />
          </div>
        </div>

        <Button type="submit" size="sm">Submit</Button>
      </form>
    </Form>
  )
}

export default TransactionForm
