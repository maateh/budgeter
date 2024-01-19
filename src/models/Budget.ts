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

  // localstorage helper functions
  static async findAll(): Promise<{[key: string]: Budget}> {
    const plainBudgets = localStorage.getItem('budgets') || '{}'
    const parsedBudgets: {[key: string]: Budget} = JSON.parse(plainBudgets)

    return Object.entries(parsedBudgets)
      .reduce((budgets, [key, budget]) => ({
        ...budgets,
        [key]: new Budget(budget.id, budget)
      }), {})
  }

  static async find(id: string): Promise<Budget> {
    const budgets = await Budget.findAll()
    const budget = budgets[id]

    if (!budget) {
      throw Error('Budget not found with the specified ID.')
    }

    return budget
  }

  static async save(id: string, props: BudgetProps): Promise<Budget> {
    const budgets = await Budget.findAll()

    budgets[id] = new Budget(id, props)
    localStorage.setItem('budgets', JSON.stringify(budgets))

    return budgets[id]
  }

  static async delete(id: string) {
    const budgets = await Budget.findAll()

    delete budgets[id]
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }

  static async addTransactions(budgetId: string, transactions: Transaction[]) {
    const budget = await Budget.find(budgetId)
    budget.executeTransactions(transactions)

    await Budget.save(budget.id, budget)
  }

  static async deleteTransactions(budgetId: string, transactionIds: string[]) {
    const budget = await Budget.find(budgetId)
    transactionIds.forEach(id => delete budget.transactions[id])

    await Budget.save(budget.id, budget)
  }
}

export default Budget
