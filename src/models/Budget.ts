import { UUID } from "crypto"

// models
import Transaction, { TransactionType } from "./Transaction"

export type BudgetProps = {
  name: string,
  type: BudgetType,
  balance: Balance,
  theme: BudgetTheme,
  transactions?: Transaction[]
}

export type Balance = {
  current: number;
  starting: number;
  max: number;
}

export type BudgetTheme = {
  background: string;
  foreground: string;
}

export enum BudgetType {
  INCOME = 'income',
  DEBT = 'debt'
}

class Budget {
  public name
  public type
  public balance
  public transactions
  public theme

  constructor(readonly id: UUID, props: BudgetProps) {
    this.name = props.name
    this.type = props.type
    this.balance = props.balance
    this.theme = props.theme
    
    this.transactions = props.transactions?.map(t => new Transaction(t.id, t)) || []
  }

  get income(): number {
    return this.transactions
      .filter(tr => tr.type === TransactionType.INCOME)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, -this.balance.starting)
  }

  get loss(): number {
    return this.transactions
      .filter(tr => tr.type === TransactionType.LOSS)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  get profit(): number {
    // TODO: [+] and [-] transactions
    return this.balance.current - this.balance.starting
  }

  executeTransactions(...transactions: Transaction[]): Transaction[] {
    transactions.forEach(t => {
      this.transactions.push(t)
      this.balance.current += t.amount
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

  static find(id: UUID) {
    const budget = this.findAll().find(b => b.id === id)

    if (!budget) {
      throw Error('Budget not found with the specified ID.')
    }

    return new Budget(budget.id, { ...budget })
  }

  static save(id: UUID, props: BudgetProps) {
    const filteredBudgets = this.findAll().filter(b => b.id !== id)
    const budget = new Budget(id, props)
    
    localStorage.setItem('budgets', JSON.stringify([
      ...filteredBudgets, budget
    ]))

    return budget
  }

  static delete(id: UUID) {
    const budgets = this.findAll()
    const filteredBudgets = budgets.filter(b => b.id !== id)
    localStorage.setItem('budgets', JSON.stringify(filteredBudgets))
  }
}

export default Budget
