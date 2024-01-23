import { useEffect, useReducer } from "react"

// types
import { StorageAction, TStorageState, TStorageAction } from "./types"

// storage
import Storage from "@/storage"

// context
import StorageContext from "./StorageContext"

// actions
import { setBudgets } from "./actions"

const storageReducer = (state: TStorageState, action: TStorageAction): TStorageState => {
  const setBudgets = ({ budgets }: TStorageAction['payload']) => ({
    ...state,
    budgets: budgets ?? {}
  })

  const setBudget = ({ budget }: TStorageAction['payload']) => {
    if (!budget) return state

    state.budgets[budget.id] = budget
    return { ...state, budgets: state.budgets }
  }

  const deleteBudget = ({ id }: TStorageAction['payload']) => {
    if (!id) return state

    delete state.budgets[id]
    return { ...state, budgets: state.budgets }
  }

  switch (action.type) {
    case StorageAction.SET_BUDGETS:
      return setBudgets(action.payload)
    case StorageAction.SET_BUDGET:
      return setBudget(action.payload)
    case StorageAction.DELETE_BUDGET:
      return deleteBudget(action.payload)
    default:
      throw new Error('StorageContext: An unexpected type of action was given.')
  }
}

const StorageContextProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(storageReducer, {
    budgets: {}
  })

  useEffect(() => {
    const fetchBudgets = async () => {
      const budgets = await Storage.budget.findAll()
      setBudgets(dispatch, budgets)
    }

    fetchBudgets()
  }, [])

  return (
    <StorageContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageContextProvider