import { Pagination, PaginationParams } from "@/services/api/types"

export function formatWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-UK', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    trailingZeroDisplay: 'stripIfInteger',
    currency
  }).format(amount)
}

export function paginate<D>(data: D[], { offset, limit }: PaginationParams): Pagination<D> {
  return {
    offset,
    limit,
    nextPageOffset: offset + limit < data.length ? offset + limit : null,
    total: data.length,
    data: data.slice(offset, offset + limit)
  }
}

export function filter<D>(documents: D[], filterBy?: Partial<D>): D[] {
  if (!filterBy) return documents

  return documents
    .filter((entry: D) => Object.keys(filterBy)
      .every((key) => filterBy[key as keyof D] === entry[key as keyof D]))
}

export function filterObject<D extends { id: string }>(documents: Record<string, D>, filter: (doc: D) => boolean): Record<string, D> {
  return Object.values(documents)
    .filter(filter)
    .reduce((docs, doc) => ({
      ...docs,
      [doc.id]: doc
    }), {} as Record<string, D>)
}
