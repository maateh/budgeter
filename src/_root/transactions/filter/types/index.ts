import { FilterOptions, Transaction } from "@/services/api/types"

export type TransactionSearchParams = {
  name: Transaction['name']
  budgetId: Transaction['budgetId']
  type: Transaction['type']
  processed: 'true' | 'false'
  dateFrom: string
  dateTo: string
  paymentFrom: number // TODO: add option to filter by payment range
  paymentTo: number // TODO: add option to filter by payment range
}

export type TransactionSearchFilter = FilterOptions<TransactionSearchParams>
