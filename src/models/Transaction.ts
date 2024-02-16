// models
import Budget from "@/models/Budget"

// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"

export type TransactionType = 'default' | 'transferring' | 'temporary'

export type Payment = {
  type: '+' | '-',
  amount: number
}

export type TransactionDate = {
  created: Date
  expected: Date
  credited?: Date
  expire?: Date
}

export type TransactionProps = {
  status: 'processed' | 'processing' // TODO: rename statuses (processing -> expected)
  expired?: boolean
  budgetId: string
  targetBudgetId?: string
  label: string
  payment: Payment
  date: TransactionDate
}

class Transaction {
  public type: TransactionType
  public status: 'processed' | 'processing' // TODO: rename statuses (processing -> expected)
  public expired?: boolean
  public budgetId: string
  public targetBudgetId?: string
  public label: string
  public payment: Payment
  public date: TransactionDate

  constructor(readonly id: string, type: TransactionType, props: TransactionProps) {
    this.type = type
    this.status = props.status
    this.expired = props.expired
    this.budgetId = props.budgetId
    this.targetBudgetId = props.targetBudgetId
    this.label = props.label
    this.payment = props.payment
    this.date = props.date
  }

  updateStatus(status: 'processed' | 'processing', budget: Budget) {
    if (status === 'processed') {
      budget.updateCurrentBalance(this)
      
      this.status = 'processed'
      this.date = {
        ...this.date,
        credited: new Date()
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
        credited: undefined
      }
    }
  }

  static convertToModel(document: TransactionDocument): Transaction {
    return new Transaction(document.id, document.type, {
      ...document,
      date: {
        created: new Date(document.date.created),
        credited: document.date.credited ? new Date(document.date.credited) : undefined,
        expected: new Date(document.date.expected),
      }
    })
  }

  static convertToDocument(model: Transaction): TransactionDocument {
    return {
      ...model,
      date: {
        created: model.date.created.toString(),
        credited: model.date.credited?.toString(),
        expected: model.date.expected.toString()
      }
    }
  }

  static bulkConvertToModel(documents: DocumentCollection['transaction'],
    predicate: (doc: TransactionDocument) => boolean): ModelCollection['transaction'] {   
    return Object.entries(documents)
      .filter(([, doc]) => predicate(doc))
      .sort(([, a], [, b]) => (
        Date.parse(a.date.credited || a.date.created) > Date.parse(b.date.credited || b.date.created) 
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
