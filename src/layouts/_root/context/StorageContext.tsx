import { createContext } from "react"

// types
import { TStorageContext } from "./types"

const StorageContext = createContext<TStorageContext>({
  budgets: {},
  dispatch: () => {}
})

export default StorageContext
