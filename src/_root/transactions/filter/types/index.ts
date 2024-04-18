import { FilterOptions, Transaction } from "@/services/api/types"

export type TransactionSearchParams = {
  name: Transaction['name']
  budgetId: Transaction['budgetId']
  type: Transaction['type']
  processed: 'true' | 'false'
  dateFrom: Date // TODO: add option to filter by ranges
  dateTo: Date // TODO: add option to filter by ranges
  paymentFrom: number // TODO: add option to filter by ranges
  paymentTo: number // TODO: add option to filter by ranges
}

export type TransactionSearchFilter = FilterOptions<TransactionSearchParams>
