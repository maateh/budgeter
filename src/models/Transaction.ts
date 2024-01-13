export enum TransactionType {
  INCOME = 'income',
  LOSS = 'loss'
}

class Transaction {
  constructor(
    readonly id: number,
    public type: TransactionType,
    public amount: number
  ) {}
}

export default Transaction
