import { DefaultValues, FieldValues, SubmitHandler, UseFormReturn, useForm } from "react-hook-form"
import { ZodType } from "zod"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

type FormProps<FV extends FieldValues, Z extends ZodType<FV>> = {
  type: 'create' | 'edit',
  customButton?: React.JSX.Element,
  defaultValues: DefaultValues<FV>,
  validationSchema: Z,
  useSubmit: (form: UseFormReturn<FV>) => {
    onSubmit: SubmitHandler<FV>
    isPending: boolean
  },
  children: (methods: UseFormReturn<FV>) => React.ReactNode
}

function Form<FV extends FieldValues, Z extends ZodType<FV>>({ type, customButton, defaultValues, validationSchema, useSubmit, children }: FormProps<FV, Z>) {
  const form = useForm<FV>({
    resolver: zodResolver(validationSchema),
    defaultValues
  })
  const { onSubmit, isPending } = useSubmit(form)
  
  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-3.5">

        {children(form)}

        {customButton || (
          <Button
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
