import { FieldValues, SubmitHandler, UseFormProps, UseFormReturn, useForm } from "react-hook-form"

import { ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Button } from "@/components/ui/button"
import { Form as ShadcnForm } from "@/components/ui/form"

type FormProps<FV extends FieldValues, Z extends ZodType<FV>, P = object> = {
  type: 'create' | 'edit',
  validationSchema: Z,
  useSubmit: (form: UseFormReturn<FV>, props: P) => {
    onSubmit: SubmitHandler<FV>
    isPending: boolean
  },
  submitProps?: P
  customButtonRequired?: boolean,
  children: (methods: UseFormReturn<FV>, isPending: boolean) => React.ReactNode
} & UseFormProps<FV, Z>

function Form<FV extends FieldValues, Z extends ZodType<FV>, P = object>({
  type, customButtonRequired, validationSchema, useSubmit, submitProps, children, ...props
}: FormProps<FV, Z, P>) {
  const form = useForm<FV>({
    resolver: zodResolver(validationSchema),
    ...props
  })
  const { onSubmit, isPending } = useSubmit(form, submitProps || {} as P)
  
  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">

        {children(form, isPending)}

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
