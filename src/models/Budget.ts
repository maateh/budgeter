// models
import Transaction, { TransactionType } from "./Transaction"

export enum BudgetType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export type Balance = {
  current: number
  ceiling: number
}

export type BudgetTheme = {
  background: string
  foreground: string
}

export type BudgetProps = {
  name: string
  type: BudgetType
  balance: Balance
  theme: BudgetTheme
  transactions?: {[key: string]: Transaction}
}

class Budget {
  public name: string
  public type: BudgetType
  public balance: Balance
  public theme: BudgetTheme
  public transactions: {[key: string]: Transaction}

  constructor(readonly id: string, props: BudgetProps) {
    this.name = props.name
    this.type = props.type
    this.balance = props.balance
    this.theme = props.theme

    this.transactions = props.transactions ?? {}
  }

  get income(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.type === TransactionType.PLUS)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  get loss(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.type === TransactionType.MINUS)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  executeTransactions(transactions: Transaction[]) {
    transactions.forEach(t => {
      this.transactions = {
        [t.id]: t,
        ...this.transactions
      }

      this.updateCurrentBalance(t)
    })
  }

  private updateCurrentBalance(transaction: Transaction) {
    this.balance.current += transaction.type === TransactionType.PLUS
      ? transaction.amount
      : -transaction.amount
  }
}

export default Budget
