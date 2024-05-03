const KEY_REF_SPLITTER = '.'

/**
 * Extract the entry value corresponding to the key reference from the document.
 * 
 * @template T - The type of the document.
 * @param {T} document - The document from which to extract the nested value.
 * @param {string} keyRef - The reference to the nested value, using dot notation.
 * @returns {(string | number | undefined)} The extracted nested value.
 */
function getNestedValue<T>(document: T, keyRef: string): string | number | boolean | undefined {
  let entryValue: string | number | boolean | undefined
  keyRef.split(KEY_REF_SPLITTER)
    .reduce((doc, key) => {
      const nestedValue = doc[key as keyof T] as (T | number | string | boolean)
      if (typeof nestedValue === 'number' || typeof nestedValue === 'string' || typeof nestedValue === 'boolean') {
        entryValue = nestedValue
        return doc
      }
      return nestedValue
    }, document as T)
  
  return entryValue
}

export default getNestedValue
