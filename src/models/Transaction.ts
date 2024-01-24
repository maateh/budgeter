export enum TransactionType {
  PLUS = '+',
  MINUS = '-'
}

export type TransactionProps = {
  budgetId: string
  type: TransactionType
  amount: number
  date: Date
}

class Transaction {
  public budgetId
  public type
  public amount
  public date

  constructor(readonly id: string, props: TransactionProps) {
    this.budgetId = props.budgetId
    this.type = props.type
    this.amount = props.amount
    this.date = props.date
  }
}

export default Transaction
