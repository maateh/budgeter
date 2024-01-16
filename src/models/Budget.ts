// models
import Transaction from "./Transaction"

export type BudgetProps = {
  name: string,
  type: BudgetType,
  balance: Balance,
  theme: BudgetTheme,
  transactions?: Transaction[]
}

export type Balance = {
  current: number;
  ceiling: number;
}

export type BudgetTheme = {
  background: string;
  foreground: string;
}

export enum BudgetType {
  INCOME = 'income',
  EXPENSE = 'expense'
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
    
    this.transactions = props.transactions?.map(t => new Transaction(t.id, t)) || []
  }

  get income(): number {
    return this.transactions
      .filter(tr => tr.amount > 0)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  get loss(): number {
    return this.transactions
      .filter(tr => tr.amount < 0)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  executeTransactions(...transactions: Transaction[]): Transaction[] {
    transactions.forEach(t => {
      this.transactions.push(t)

      if (this.type === BudgetType.INCOME) {
        this.balance.current += t.amount
      } else {
        this.balance.current -= t.amount
      }
    })

    Budget.save(this.id, this)
    return this.transactions
  }

  // localstorage helper functions
  static findAll(): Budget[] {
    const plainBudgets = localStorage.getItem('budgets') || '[]'
    const parsedBudgets: Budget[] = JSON.parse(plainBudgets)
    return parsedBudgets.map(b => new Budget(b.id, { ...b }))
  }

  static find(id: string) {
    const budget = this.findAll().find(b => b.id === id)

    if (!budget) {
      throw Error('Budget not found with the specified ID.')
    }

    return new Budget(budget.id, { ...budget })
  }

  static save(id: string, props: BudgetProps) {
    const filteredBudgets = this.findAll().filter(b => b.id !== id)
    const budget = new Budget(id, props)
    
    localStorage.setItem('budgets', JSON.stringify([
      ...filteredBudgets, budget
    ]))

    return budget
  }

  static delete(id: string) {
    const budgets = this.findAll()
    const filteredBudgets = budgets.filter(b => b.id !== id)
    localStorage.setItem('budgets', JSON.stringify(filteredBudgets))
  }
}

export default Budget
