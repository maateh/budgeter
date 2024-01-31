// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"

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

  static bulkConvertToModel(documents: DocumentCollection['transaction']): ModelCollection['transaction'] {   
    return Object.entries(documents)
      .sort(doc => Date.parse(doc[1].date))
      .reduce((models, [key, document]) => ({
        ...models,
        [key]: this.convertToModel(document)
      }), {})
  }

  static bulkConvertToDocument(models: ModelCollection['transaction']): DocumentCollection['transaction'] {
    return Object.entries(models)
      .reduce((documents, [key, model]) => ({
        ...documents,
        [key]: this.convertToDocument(model)
      }), {})
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
