import { createContext, useEffect, useReducer } from "react"

// types
import { StorageAction, TStorageState, TStorageAction, TStorageContext } from "./types"

// models
import Budget from "@/models/Budget"

// actions
import { setBudgets } from "./actions"

const storageReducer = (state: TStorageState, action: TStorageAction): TStorageState => {
  switch (action.type) {
    case StorageAction.SET_BUDGETS:
      return {
        ...state,
        budgets: action.payload.budgets || []
      }
    case StorageAction.ADD_BUDGET:
      return {
        ...state,
        budgets: action.payload.budget ? [
          ...state.budgets.filter(b => b.id !== action.payload.budget.id),
          action.payload.budget
        ] : state.budgets
      }
    case StorageAction.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload.id),
      }
    default:
      throw new Error('StorageContext: An unexpected type of action was given.')
  }
}

const initialStorageState: TStorageState = {
  budgets: Budget.findAll()
}

export const StorageContext = createContext<TStorageContext>({
  state: initialStorageState,
  dispatch: () => {}
})

const StorageContextProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(storageReducer, initialStorageState)

  useEffect(() => {
    const fetchBudgets = () => {
      const budgets = Budget.findAll()
      setBudgets(dispatch, budgets)
    }

    fetchBudgets()
  }, [])

  return (
    <StorageContext.Provider value={{ state, dispatch }}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageContextProvider
