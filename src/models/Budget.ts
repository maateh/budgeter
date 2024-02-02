// types
import { BudgetDocument, DocumentCollection, ModelCollection } from "@/types"

// models
import Transaction, { TransactionType } from "@/models/Transaction"

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
  transactions?: ModelCollection['transaction']
}

class Budget {
  public name: string
  public type: BudgetType
  public balance: Balance
  public theme: BudgetTheme
  public transactions: ModelCollection['transaction']

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
  
  undoTransactions(transactionIds: string[]) {
    transactionIds.forEach(id => {
      const transaction = this.transactions[id]
      transaction.amount = transaction.amount * -1
      
      this.updateCurrentBalance(transaction)
      delete this.transactions[id]
    })
  }

  private updateCurrentBalance(transaction: Transaction) {
    this.balance.current += transaction.type === TransactionType.PLUS
      ? transaction.amount
      : -transaction.amount
  }

  static convertToModel(document: BudgetDocument, transactions: ModelCollection['transaction']): Budget {
    return new Budget(document.id, { ...document, transactions })
  }

  static convertToDocument(model: Budget): BudgetDocument {
    const transactionIds = Object.keys(model.transactions)
    return {
      id: model.id,
      name: model.name,
      type: model.type,
      balance: model.balance,
      theme: model.theme,
      transactionIds
    }
  }

  static bulkConvertToModel(
    documents: DocumentCollection['budget'],
    transactions: ModelCollection['transaction']
  ): ModelCollection['budget'] {
    return Object.entries(documents)
      .reduce((models, [key, document]) => {
        const budgetTransactions = Transaction.filterByBudget(key, transactions)
        return {
          ...models,
          [key]: Budget.convertToModel(document, budgetTransactions)
        } 
      }, {})
  }

  static bulkConvertToDocument(models: ModelCollection['budget']): DocumentCollection['budget'] {
    return Object.entries(models)
      .reduce((documents, [key, model]) => ({
        ...documents,
        [key]: this.convertToDocument(model)
      }), {})
  }
}

export default Budget
