import { useState } from "react"
import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

// models
import Budget, { BudgetType } from "@/models/Budget"

// validations
import { BudgetValidation } from "@/lib/validation"

const CreateBudgetSheet = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof BudgetValidation>>({
    resolver: zodResolver(BudgetValidation),
    defaultValues: {
      name: "",
      type: BudgetType.INCOME,
      balance: {
        current: 0,
        starting: 0,
        max: 0
      },
      theme: {
        background: "",
        foreground: ""
      }
    }
  })

  function onSubmit(values: z.infer<typeof BudgetValidation>) {
    const { name, type, balance, theme } = values
    const budget = new Budget(1, name, type, balance, [], theme)
    Budget.create(budget)
    // Budget.delete(1)

    setOpen(false)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" border="md" size="xl" className="ml-auto">
          New Budget
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>
            Create a Budget
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      defaultValue={BudgetType.INCOME}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-x-6 gap-y-3"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={BudgetType.INCOME} />
                        </FormControl>
                        <FormLabel>{BudgetType.INCOME}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={BudgetType.DEBT} />
                        </FormControl>
                        <FormLabel>{BudgetType.DEBT}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap justify-center items-end gap-x-8 gap-y-4">
              <FormField
                control={form.control}
                name="balance.current"
                render={({ field }) => (
                  <FormItem className="min-w-36 flex-1">
                    <FormLabel className="font-heading text-xl small-caps">
                      Current Balance
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. $35"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance.starting"
                render={({ field }) => (
                  <FormItem className="min-w-36 flex-1">
                    <FormLabel className="font-heading text-xl small-caps">
                      Starting Balance
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. $10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance.max"
                render={({ field }) => (
                  <FormItem className="min-w-36 flex-1">
                    <FormLabel className="font-heading text-xl small-caps">
                      Budget Ceiling
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

            <div className="flex flex-wrap justify-center items-end gap-x-8 gap-y-4">
              <FormField
                control={form.control}
                name="theme.background"
                render={({ field }) => (
                  <FormItem className="min-w-36 flex-1">
                    <FormLabel className="font-heading text-xl small-caps">
                      Custom Background Color
                    </FormLabel>
                    <FormControl>
                      {/* TODO: color picker */}
                      <Input
                        type="string"
                        placeholder="e.g. #dedede"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme.foreground"
                render={({ field }) => (
                  <FormItem className="min-w-36 flex-1">
                    <FormLabel className="font-heading text-xl small-caps">
                    Custom Foreground Color
                    </FormLabel>
                    <FormControl>
                      {/* TODO: color picker */}
                      <Input
                        type="string"
                        placeholder="e.g. #242424"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button type="submit" size="lg" className="all-small-caps">
                Create
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default CreateBudgetSheet
