// components
import SubpaymentForm from "@/components/form/subpayment/SubpaymentForm"

// types
import { Budget, Transaction } from "@/services/api/types"

type SubpaymentsProps = {
  transaction: Transaction & { budget: Budget }
}

const Subpayments = ({ transaction }: SubpaymentsProps) => {
  // TODO: implement layout
  return (
    <SubpaymentForm />
  )
}

export default Subpayments
