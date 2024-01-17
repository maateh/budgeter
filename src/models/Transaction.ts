export type TransactionProps = {
  amount: number
  date: Date
}

class Transaction {
  public amount
  public date

  constructor(readonly id: string, props: TransactionProps) {
    this.amount = props.amount
    this.date = props.date
  }
}

export default Transaction
