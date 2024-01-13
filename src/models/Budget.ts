// models
import Transaction from "./Transaction"

export enum BudgetType {
  INCOME = 'income',
  DEBT = 'debt'
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

class Budget {
  constructor(
    readonly id: number,
    public name: string,
    public type: BudgetType,
    public balance: Balance,
    public transactions: Transaction[] = [],
    public theme: BudgetTheme
  ) {}

  get income(): number {
    // TODO: [+] transactions
    return 0
  }

  get loss(): number {
    // TODO: [-] transactions
    return 0
  }

  get profit(): number {
    // TODO: [+] and [-] transactions
    return 0
  }

  // localstorage helper functions
  static findAll(): Budget[] {
    const budgets = localStorage.getItem('budgets') || '[]'
    return JSON.parse(budgets)
  }

  static find(id: number) {
    return this.findAll().find(b => b.id === id)
  }

  static create(budget: Budget) {
    const budgets = this.findAll()
    localStorage.setItem('budgets', JSON.stringify([
      ...budgets, budget
    ]))
  }

  static delete(id: number) {
    const budgets = this.findAll()
    const filteredBudgets = budgets.filter(b => b.id !== id)
    localStorage.setItem('budgets', JSON.stringify(filteredBudgets))
  }
}

export default Budget
