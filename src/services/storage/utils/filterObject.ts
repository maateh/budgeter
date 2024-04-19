/**
 * Filters an object of documents based on the provided filter function.
 * @param documents - The object of documents to filter.
 * @param filter - The function used as a filter criteria.
 * @returns An object of documents that match the filter criteria.
 */
function filterObject<D extends { id: string }>(documents: Record<string, D>, filter: (doc: D) => boolean): Record<string, D> {
  return Object.values(documents)
    .filter(filter)
    .reduce((docs, doc) => ({
      ...docs,
      [doc.id]: doc
    }), {} as Record<string, D>)
}

export default filterObject
