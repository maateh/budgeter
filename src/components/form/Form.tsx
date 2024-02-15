import { FieldValues, SubmitHandler, UseFormReturn, useForm } from "react-hook-form"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

type FormProps<FV extends FieldValues> = {
  type: 'create' | 'edit'
  customButton?: React.JSX.Element
  useSubmit: (form: UseFormReturn<FV>) => {
    onSubmit: SubmitHandler<FV>
    isPending: boolean
  }
  children: (methods: UseFormReturn<FV>) => React.ReactNode
}

function Form<FV extends FieldValues>({ type, customButton, useSubmit, children }: FormProps<FV>) {
  const form = useForm<FV>()
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
