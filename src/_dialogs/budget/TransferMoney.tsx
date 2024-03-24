import { useParams } from "react-router-dom"

// shadcn
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import TransferMoneyForm from "@/components/form/transfer-money/TransferMoneyForm"

const TransferMoney = () => {
  const { id } = useParams() as { id: string }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-3xl capitalize">
          <span className="text-blue-400 overline">Transfer</span> Money
        </DialogTitle>
      </DialogHeader>

      <Separator />

      <TransferMoneyForm budgetId={id} />
    </DialogContent>
  )
}

export default TransferMoney
