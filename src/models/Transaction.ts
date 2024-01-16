export type TransactionProps = {
  amount: number
}

class Transaction {
  public amount

  constructor(readonly id: string, props: TransactionProps) {
    this.amount = props.amount
  }
}

export default Transaction
