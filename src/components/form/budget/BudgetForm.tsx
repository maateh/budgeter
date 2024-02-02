import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

// components
import ColorPicker from "@/components/shared/ColorPicker"

// models
import Budget, { BudgetType } from "@/models/Budget"

// validations
import { BudgetValidation } from "@/lib/validation"

// hooks
import { useSaveBudgetMutation } from "./BudgetForm.hooks"

type BudgetFormProps = {
  type: "create" | "edit"
  budget?: Budget
  cleanForm?: () => void
}

const BudgetForm = ({ type, budget, cleanForm = () => {} }: BudgetFormProps) => {
  const { mutateAsync: saveBudget } = useSaveBudgetMutation()

  const form = useForm<z.infer<typeof BudgetValidation>>({
    resolver: zodResolver(BudgetValidation),
    defaultValues: {
      id: budget?.id || crypto.randomUUID(),
      name: budget?.name || "",
      type: budget?.type || BudgetType.INCOME,
      balance: budget?.balance || {
        current: 0,
        ceiling: 0
      },
      theme: budget?.theme || {
        background: '#dedede',
        foreground: '#202020'
      }
    }
  })

  async function onSubmit(values: z.infer<typeof BudgetValidation>) {
    if (type === 'create' && values.type === BudgetType.EXPENSE) {
      values.balance.current = values.balance.ceiling
    }

    const budget = new Budget(values.id, values)
    try {
      await saveBudget(budget)

      form.reset()
      form.setValue("id", crypto.randomUUID())
      cleanForm()
    } catch (err) {
      console.error(err)
    }

    // TODO: add initial transactions
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 space-y-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-heading text-xl small-caps">
                Budget Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. Food"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-xl small-caps">
                  Type
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-x-6 gap-y-3"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={BudgetType.INCOME} />
                      </FormControl>
                      <FormLabel className="text-md font-semibold cursor-pointer">
                        {BudgetType.INCOME}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={BudgetType.EXPENSE} />
                      </FormControl>
                      <FormLabel className="text-md font-semibold cursor-pointer">
                        {BudgetType.EXPENSE}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="balance.ceiling"
            render={({ field }) => (
              <FormItem className="min-w-36 flex-1">
                <FormLabel className="font-heading text-xl small-caps">
                  Expected Ceiling
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. $200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col justify-center gap-y-2">
          <FormField
            control={form.control}
            name="theme.background"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-4">
                <FormLabel className="font-heading text-xl small-caps">
                  Custom Background Color
                </FormLabel>
                <FormControl>
                  <>
                    <Input type="hidden" {...field} />
                    <ColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme.foreground"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-4">
                <FormLabel className="font-heading text-xl small-caps">
                  Custom Foreground Color
                </FormLabel>
                <FormControl>
                  <>
                    <Input type="hidden" {...field} />
                    <ColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-4 sm:ml-auto small-caps capitalize"
        >
          {type}
        </Button>
      </form>
    </Form>
  )
}

export default BudgetForm
