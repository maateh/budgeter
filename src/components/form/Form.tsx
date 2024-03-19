import { DefaultValues, FieldValues, SubmitHandler, UseFormReturn, useForm } from "react-hook-form"

import { ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

type FormProps<FV extends FieldValues, Z extends ZodType<FV>, P = object> = {
  type: 'create' | 'edit',
  customButtonRequired?: boolean,
  defaultValues?: DefaultValues<FV>,
  validationSchema: Z,
  useSubmit: (form: UseFormReturn<FV>, props: P) => {
    onSubmit: SubmitHandler<FV>
    isPending: boolean
  },
  submitProps?: P
  children: (methods: UseFormReturn<FV>) => React.ReactNode
}

function Form<FV extends FieldValues, Z extends ZodType<FV>, P = object>({
  type, customButtonRequired, defaultValues, validationSchema, useSubmit, submitProps, children
}: FormProps<FV, Z, P>) {
  const form = useForm<FV>({
    resolver: zodResolver(validationSchema),
    defaultValues
  })
  const { onSubmit, isPending } = useSubmit(form, submitProps || {} as P)
  
  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">

        {children(form)}

        {!customButtonRequired && (
          <Button
            className="mt-4 w-full min-w-28 capitalize sm:w-fit sm:ml-auto"
            size="lg"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : type}
          </Button>
        )}
      </form>
    </ShadcnForm>
  )
}

export default Form
