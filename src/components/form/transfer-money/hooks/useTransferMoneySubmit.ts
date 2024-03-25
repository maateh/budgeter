import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useTransferMoney } from "@/lib/react-query/mutations"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

const useTransferMoneySubmit = (form: UseFormReturn<TransferMoneyFieldValues>) => {
  const navigate = useNavigate()

  const { mutateAsync: transferMoney, isPending } = useTransferMoney()

  const onSubmit: SubmitHandler<TransferMoneyFieldValues> = async (values) => {
    try {
      await transferMoney(values)

      form.reset()
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransferMoneySubmit
