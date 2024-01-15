import { UUID } from "crypto"

export type TransactionProps = {
  type: TransactionType,
  amount: number
}

export enum TransactionType {
  INCOME = 'income',
  LOSS = 'loss'
}

class Transaction {
  public type
  public amount

  constructor(readonly id: UUID, props: TransactionProps) {
    this.type = props.type
    this.amount = props.amount
  }
}

export default Transaction
