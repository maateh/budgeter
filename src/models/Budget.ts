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

export type BudgetNote = {
  id: string
  text: string
  date: {
    created: Date
    edited?: Date
    closed?: Date
  }
}

export type BudgetProps = {
  name: string
  type: BudgetType
  balance: Balance
  currency: string
  theme: BudgetTheme
  transactions?: ModelCollection['transaction']
  notes?: {[key: string]: BudgetNote}
}

class Budget {
  public name: string
  public type: BudgetType
  public balance: Balance
  public currency: string
  public theme: BudgetTheme
  public transactions: ModelCollection['transaction']
  public notes: {[key: string]: BudgetNote}

  constructor(readonly id: string, props: BudgetProps) {
    this.name = props.name
    this.type = props.type
    this.balance = props.balance
    this.currency = props.currency
    this.theme = props.theme
    this.transactions = props.transactions ?? {}
    this.notes = props.notes ?? {}
  }

  get income(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.status === 'processed' && tr.type === TransactionType.PLUS)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  get loss(): number {
    return Object.values(this.transactions)
      .filter(tr => tr.status === 'processed' && tr.type === TransactionType.MINUS)
      .reduce((currentTotal, tr) => currentTotal + tr.amount, 0)
  }

  updateCurrentBalance(transaction: Transaction) {
    this.balance.current += transaction.type === TransactionType.PLUS
      ? transaction.amount
      : -transaction.amount
  }

  addTransactions(transactions: Transaction[], execute: boolean = false) {
    transactions.forEach(tr => {
      this.transactions = {
        [tr.id]: tr,
        ...this.transactions
      }

      if (execute && tr.status === 'processed') this.updateCurrentBalance(tr)
    })
  }

  removeTransactions(transactionIds: string[], undo: boolean = false) {
    transactionIds.forEach(id => {
      const transaction = this.transactions[id]
      transaction.amount = transaction.amount * -1

      if (undo && transaction.status === 'processed') this.updateCurrentBalance(transaction)
      delete this.transactions[id]
    })
  }

  executeTransactions(transactions: Transaction[]) {
    transactions.forEach(tr => {
      if (tr.status === 'processed') {
        this.updateCurrentBalance(tr)
      }
    })
  }
  
  undoTransactions(transactionIds: string[]) {
    transactionIds.forEach(id => {
      const transaction = this.transactions[id]
      transaction.amount = transaction.amount * -1
      
      this.updateCurrentBalance(transaction)
    })
  }

  addNote(note: BudgetNote) {
    this.notes[note.id] = note
  }

  removeNote(id: string) {
    delete this.notes[id]
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
      currency: model.currency,
      theme: model.theme,
      notes: model.notes,
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
