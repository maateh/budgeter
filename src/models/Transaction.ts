import { UUID } from "crypto"

export type TransactionProps = {
  amount: number
}

class Transaction {
  public amount

  constructor(readonly id: UUID, props: TransactionProps) {
    this.amount = props.amount
  }
}

export default Transaction
