// models
import Transaction, { TransactionProps } from "@/models/Transaction"

export type TemporaryTransactionProps = TransactionProps & {
  date: {
    expire: Date
  }
}

class TemporaryTransaction extends Transaction {
  readonly type: 'temporary'
  public date: Transaction['date'] & { expire: Date }

  constructor(id: string, props: TemporaryTransactionProps) {
    super(id, props)
    this.type = 'temporary'
    this.date = props.date
  }
}

export default TemporaryTransaction
