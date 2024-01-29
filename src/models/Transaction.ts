// types
import { ModelCollection, TransactionDocument } from "@/types"

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

  static convertToModel(document: TransactionDocument): Transaction {
    return new Transaction(document.id, {
      ...document,
      date: new Date(document.date)
    })
  }

  static convertToDocument(model: Transaction): TransactionDocument {
    return {
      ...model,
      date: model.date.toString()
    }
  }

  static filterByBudget(budgetId: string, models: ModelCollection['transaction']): ModelCollection['transaction'] {
    return Object.entries(models)
      .filter(t => t[1].budgetId === budgetId)
      .reduce((transactions, [key, transaction]) => ({
        ...transactions,
        [key]: transaction
      }), {})
  }
}

export default Transaction
