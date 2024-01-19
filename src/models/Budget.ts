// models
import Transaction from "./Transaction"

export enum BudgetType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

type Balance = {
  current: number;
  ceiling: number;
}

type BudgetTheme = {
  background: string;
  foreground: string;
}

export type BudgetProps = {
  name: string,
  type: BudgetType,
  balance: Balance,
  theme: BudgetTheme,
  transactions?: {[key: string]: Transaction}
}

class Budget {
  public name
  public type
  public balance
  public transactions
  public theme

  constructor(readonly id: string, props: BudgetProps) {
    this.name = props.name
    this.type = props.type
    this.balance = props.balance
    this.theme = props.theme
    
    this.transactions = props.transactions ?? {}
  }

  get income(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.amount > 0)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  get loss(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.amount < 0)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  executeTransactions(transactions: Transaction[]) {
    transactions.forEach(t => {
      this.transactions = {
        [t.id]: t,
        ...this.transactions
      }

      if (this.type === BudgetType.INCOME) {
        this.balance.current += t.amount
      } else {
        this.balance.current -= t.amount
      }
    })
  }
}

export default Budget
