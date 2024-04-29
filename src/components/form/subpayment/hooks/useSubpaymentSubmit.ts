import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useAddSubpayment } from "@/lib/react-query/mutations"

// types
import { SubpaymentFieldValues, SubpaymentSubmitProps } from "@/components/form/subpayment/types"

const useSubpaymentSubmit = (form: UseFormReturn<SubpaymentFieldValues>, { transactionId }: SubpaymentSubmitProps) => {
  const { toast } = useToast()

  const { mutateAsync: createSubpayment, isPending } = useAddSubpayment(transactionId)

  const onSubmit: SubmitHandler<SubpaymentFieldValues> = async (values) => {
    try {
      await createSubpayment({
        id: transactionId,
        data: values
      })

      form.reset()

      toast({
        variant: 'accent',
        title: 'Added: Subpayment',
        description: 'Subpayment has been successfully credited.'
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to add subpayment.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useSubpaymentSubmit
