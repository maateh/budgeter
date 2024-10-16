import { FilterOptions, Payment, Transaction } from "@/services/api/types"

export type TransactionSearchParams = {
  name: Transaction['name']
  budgetId: Transaction['budgetId']
  type: Transaction['type']
  processed: 'true' | 'false'
  paymentType: Payment['type']
} & SearchDateRange & SearchPaymentRange

export type SearchDateRange = {
  dateFrom: string
  dateTo: string
}

export type SearchPaymentRange = {
  paymentMin?: string
  paymentMax?: string
}

export type TransactionSearchFilter = FilterOptions<TransactionSearchParams>
