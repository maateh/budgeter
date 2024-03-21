import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { Handshake, Minus, Plus, Receipt, Verified, XCircle } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch, SwitchThumb } from "@/components/ui/switch"

// components
import TabsSelect from "@/components/input/TabsSelect"
import BudgetSelector from "@/components/input/BudgetSelector"
import DateTimePicker from "@/components/input/DateTimePicker"
import StateToggle from "@/components/ui/custom/StateToggle"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"
import { Transaction } from "@/services/api/types"

type TransactionFormFieldsProps = {
  budgetId?: string
  form: UseFormReturn<TransactionFieldValues>
}

const TransactionFormFields = ({ budgetId, form }: TransactionFormFieldsProps) => {
  const { control } = form

  const typeField = useWatch({
    control,
    name: 'type'
  })
  
  const processedField = useWatch({
    control,
    name: 'processed'
  })

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
                setValue={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="w-full flex flex-wrap justify-around gap-x-8 gap-y-5">
        {!budgetId && (
          <FormField
            control={control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="min-w-36 flex-1">
                <FormLabel>Select a Budget</FormLabel>
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
        <FormLabel>
          {typeField === 'default' ? 'Payment' : 'Borrowed Money'}
        </FormLabel>

        <div className="flex items-center gap-x-2.5">
          <FormField
            control={control}
            name="payment.type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StateToggle<Transaction['payment']['type'], Transaction['payment']['type']>
                    type="button"
                    className={`rounded-xl p-1.5
                      ${field.value === '+'
                        ? 'bg-accent hover:bg-accent/90'
                        : 'bg-red-500 hover:bg-red-500/90'}
                    `}
                    status={field.value as Transaction['payment']['type']}
                    icon={{
                      "+": <Plus size={20} strokeWidth={4} />,
                      '-': <Minus size={20} strokeWidth={4} />
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
      </div>

      <div className="flex flex-col gap-y-1.5">
        <FormField
          control={control}
          name="processed"
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
          name="processedAt"
          render={({ field }) => processedField ? (
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
