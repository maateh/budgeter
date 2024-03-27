import { SubmitHandler } from "react-hook-form"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"

const useSubpaymentSubmit = () => {
  // TODO: implement
  // const { mutateAsync: createSubpayment, isPending } = useCreateSubpayment()

  const onSubmit: SubmitHandler<SubpaymentFieldValues> = async (values) => {
    try {
      // await createSubpayment(values)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending: false }
}

export default useSubpaymentSubmit
