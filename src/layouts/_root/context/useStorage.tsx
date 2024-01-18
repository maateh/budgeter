import { useContext } from "react"

import { StorageContext } from "./StorageContext"

const useStorage = () => {
  const context = useContext(StorageContext)

  if (!context) {
    throw new Error('StorageContext must be used in its own ContextProvider')
  }

  return context
}

export default useStorage
