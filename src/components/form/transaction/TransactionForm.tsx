/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// components
import BudgetSelector from "@/components/ui/custom/BudgetSelector"
import DateTimePicker from "@/components/ui/custom/DateTimePicker"

// hooks
import { useTransactionForm } from "@/components/form/transaction/hooks"

// models
import Transaction from "@/models/Transaction"

type TestTransactionFormProps = {
  type: Transaction['type']
  budgetId?: string
  useTransactionSubmit: (form: UseFormReturn) => {
    onSubmit: SubmitHandler<any>
    isPending: boolean
  }
}

const TestTransactionForm = ({ type, budgetId, useTransactionSubmit }: TestTransactionFormProps) => {
  const form = useTransactionForm(type, budgetId)
  const { control, handleSubmit, watch } = form

  const { onSubmit, isPending } = useTransactionSubmit(form as any)

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <FormField
          control={control}
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
            control={control}
            name="payment.type"
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
                      className={field.value === '+'
                        ? 'bg-green-500/50 hover:bg-green-500/60'
                        : 'bg-red-500/80 hover:bg-red-500/90'
                      }
                      onClick={() => {
                        field.onChange(field.value === '+' ? '-' : '+')
                      }}
                    >
                      {field.value === '+' ? (
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
            control={control}
            name="payment.amount"
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

        <div>
          <FormLabel className="font-heading text-md font-normal small-caps">
            Under Processing
          </FormLabel>

          <div className="h-max flex items-center justify-between gap-x-2">
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Switch
                      checked={field.value as Transaction['status'] === 'processing'}
                      onCheckedChange={() => field.onChange(
                        field.value as Transaction['status'] === 'processing'
                          ? 'processed'
                          : 'processing'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="expectedDate"
              render={({ field }) => watch('status') as Transaction['status'] === 'processing' ? (
                <FormItem className="w-full flex items-center">
                  <FormControl>
                    <DateTimePicker
                      label="Expected date..."
                      selected={field.value!}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) : <></>}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default TestTransactionForm
