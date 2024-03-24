import { SubmitHandler } from "react-hook-form"

// hooks
// import { useTransferMoney } from "@/lib/react-query/mutations"

// types
import { TransferMoneyFieldValues } from "../types"

const useTransferMoneySubmit = () => {
  // const { mutateAsync: transferMoney } = useTransferMoney()

  const onSubmit: SubmitHandler<TransferMoneyFieldValues> = (values) => {
    try {
      // await transferMoney(values)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending: false }
}

export default useTransferMoneySubmit
