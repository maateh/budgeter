import { FilterOptions, Transaction } from "@/services/api/types"

export type TransactionSearchParams = {
  name: Transaction['name']
  budgetId: Transaction['budgetId']
  type: Transaction['type']
  processed: 'true' | 'false'
  dateFrom: string // TODO: handle filtering by date & ranges
  dateTo: string // TODO: handle filtering by date & ranges
  paymentFrom: number // TODO: add option to filter by ranges
  paymentTo: number // TODO: add option to filter by ranges
}

export type TransactionSearchFilter = FilterOptions<TransactionSearchParams>
