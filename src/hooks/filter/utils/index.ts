/**
 * Retrieves the current page index from the URL search params.
 * 
 * @param {URLSearchParams} params - The URL search params object.
 * @returns {number} The current page index.
 */
function getCurrentPage(params: URLSearchParams): number {
  return parseInt(params.get('page') || '1')
}

export { getCurrentPage }
