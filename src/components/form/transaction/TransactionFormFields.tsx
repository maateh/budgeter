import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { Handshake, Minus, Plus, Receipt, Verified, XCircle } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch, SwitchThumb } from "@/components/ui/switch"

// components
import TabsSelect from "@/components/input/TabsSelect"
import BudgetSelect from "@/components/input/BudgetSelect"
import DateTimePicker from "@/components/input/DateTimePicker"
import StateToggle from "@/components/ui/custom/StateToggle"
import CreateTransactionPreview from "./components/CreateTransactionPreview"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"
import { Transaction } from "@/services/api/types"

type TransactionFormFieldsProps = UseFormReturn<TransactionFieldValues> & {
  budgetId?: string
}

const TransactionFormFields = ({ control, budgetId }: TransactionFormFieldsProps) => {
  const typeField = useWatch({ control, name: 'type' })
  const budgetIdField = useWatch({ control, name: 'budgetId' })
  const paymentFields = useWatch({ control, name: 'payment' })

  return (
    <>
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center gap-y-1.5 text-center">
            <FormLabel className="text-lg small-caps">
              Select the <span className="text-muted font-medium overline">type of transaction</span>
            </FormLabel>
            <FormControl>
              <TabsSelect<Transaction['type']>
                tabItems={[
                  { value: 'default', Icon: Receipt },
                  { value: 'borrow', Icon: Handshake }
                ]}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CreateTransactionPreview
        budgetId={budgetIdField}
        payment={{
          ...paymentFields,
          amount: typeField === 'default'
            ? paymentFields.processed ? paymentFields.amount : 0
            : paymentFields.processed ? 0 : paymentFields.amount,
          createdAt: new Date()
        }}
      />

      <Separator className="w-2/3 h-0.5 mx-auto rounded-full" />

      <div className="w-full flex flex-wrap justify-around gap-x-8 gap-y-5">
        {!budgetId && (
          <FormField
            control={control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="min-w-36 flex-1">
                <FormLabel>Select a Budget</FormLabel>
                <FormControl>
                  <BudgetSelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="min-w-52 flex-1">
              <FormLabel>Transaction Name</FormLabel>
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
      </div>

      <div>
        <FormLabel htmlFor="amount">
          {typeField === 'default' ? 'Payment' : 'Borrowed Money'}
        </FormLabel>

        <div className="flex items-center gap-x-2.5">
          <FormField
            control={control}
            name="payment.type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StateToggle
                    type="button"
                    className={`rounded-xl p-1.5
                      ${field.value === '+'
                        ? 'bg-accent hover:bg-accent/90'
                        : 'bg-red-500 hover:bg-red-500/90'}
                    `}
                    status={field.value === '+' ? 'on' : 'off'}
                    icon={{
                      on: <Plus size={20} strokeWidth={4} />,
                      off: <Minus size={20} strokeWidth={4} />
                    }}
                    onClick={() => field.onChange(field.value === '+' ? '-' : '+')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="payment.amount"
            render={({ field }) => (
              <FormItem className="min-w-[40%]">
                <FormControl>
                  <Input id="amount"
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
      </div>

      <div className="flex flex-col gap-y-1.5">
        <FormField
          control={control}
          name="payment.processed"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2.5">
              <FormLabel>
                {typeField === 'default' ? 'Already Processed' : 'Already Paid Back'}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  customThumb={
                    <SwitchThumb
                      checked={field.value}
                      variant="custom"
                      customIcon={{
                        Checked: Verified,
                        Unchecked: XCircle
                      }}
                    />
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="payment.processedAt"
          render={({ field }) => paymentFields.processed ? (
            <FormItem className="max-w-80">
              <FormControl>
                <DateTimePicker
                  label="Select the processing date..."
                  selected={field.value!}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) : <></>}
        />
      </div>
    </>
  )
}

export default TransactionFormFields
