// models
import Transaction, { TransactionProps } from "@/models/Transaction"

export type TransferringTransactionProps = TransactionProps & {
  targetBudgetId: string
}

class TransferringTransaction extends Transaction {
  readonly type: 'transferring'
  public targetBudgetId: string

  constructor(id: string, props: TransferringTransactionProps) {
    super(id, props)
    this.type = 'transferring'
    this.targetBudgetId = props.targetBudgetId
  }
}

export default TransferringTransaction
