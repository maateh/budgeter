// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"
import Budget from "@/models/Budget"

// TODO: remove after form refactoring
export enum TransactionType {
  PLUS = '+',
  MINUS = '-'
}

export type Payment = {
  type: '+' | '-',
  amount: number
}

export type TransactionDate = {
  crediting?: Date
  expected: Date
  creation: Date
}

export type TransactionProps = {
  budgetId: string
  label: string
  payment: Payment
  status: 'processed' | 'processing'
  date: TransactionDate
}

class Transaction {
  readonly type: 'normal' | 'transferring' | 'temporary'
  public budgetId: string
  public label: string
  public payment: Payment
  public status: 'processed' | 'processing'
  public date: TransactionDate

  constructor(readonly id: string, props: TransactionProps) {
    this.type = 'normal'
    this.budgetId = props.budgetId
    this.label = props.label
    this.payment = props.payment
    this.status = props.status
    this.date = props.date
  }

  updateStatus(status: 'processed' | 'processing', budget: Budget) {
    if (status === 'processed') {
      budget.updateCurrentBalance(this)
      
      this.status = 'processed'
      this.date = {
        ...this.date,
        crediting: new Date()
      }
    }

    if (status === 'processing') {
      budget.updateCurrentBalance({
        ...this,
        payment: {
          amount: this.payment.amount * -1
        }
      })

      this.status = 'processing'
      this.date = {
        ...this.date,
        crediting: undefined
      }
    }
  }

  static convertToModel(document: TransactionDocument): Transaction {
    return new Transaction(document.id, {
      ...document,
      date: {
        creation: new Date(document.date.creation),
        crediting: document.date.crediting ? new Date(document.date.crediting) : undefined,
        expected: new Date(document.date.expected)
      }
    })
  }

  static convertToDocument(model: Transaction): TransactionDocument {
    return {
      ...model,
      date: {
        creation: model.date.creation.toString(),
        crediting: model.date.crediting?.toString(),
        expected: model.date.expected.toString()
      }
    }
  }

  static bulkConvertToModel(documents: DocumentCollection['transaction'],
    predicate: (doc: TransactionDocument) => boolean): ModelCollection['transaction'] {   
    return Object.entries(documents)
      .filter(([, doc]) => predicate(doc))
      .sort(([, a], [, b]) => (
        Date.parse(a.date.crediting || a.date.creation) > Date.parse(b.date.crediting || b.date.creation) 
          ? -1
          : 1
      ))
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
