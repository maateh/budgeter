import { createContext, useEffect, useReducer } from "react"

// types
import { StorageAction, TStorageState, TStorageAction, TStorageContext } from "./types"

// models
import Budget from "@/models/Budget"

// actions
import { setBudgets } from "./actions"

const storageReducer = (state: TStorageState, action: TStorageAction): TStorageState => {
  const setBudgets = ({ budgets }: TStorageAction['payload']) => ({
    ...state,
    budgets: budgets ?? {}
  })

  const addBudget = ({ budget }: TStorageAction['payload']) => {
    if (!budget) {
      return state
    }

    state.budgets[budget.id] = budget
    return {
      ...state,
      budgets: state.budgets
    }
  }

  const deleteBudget = ({ id }: TStorageAction['payload']) => {
    if (!id) {
      return state
    }

    state.budgets[id]
    return {
      ...state,
      budgets: state.budgets
    }
  }

  const addTransaction = ({ budget, transaction }: TStorageAction['payload']) => {
    if (!budget || !transaction) {
      return state
    }

    state.budgets[budget.id].executeTransactions([transaction])
    return {
      ...state,
      budgets: state.budgets
    }
  }

  switch (action.type) {
    case StorageAction.SET_BUDGETS:
      return setBudgets(action.payload)
    case StorageAction.ADD_BUDGET:
      return addBudget(action.payload)
    case StorageAction.DELETE_BUDGET:
      return deleteBudget(action.payload)
    case StorageAction.ADD_TRANSACTION:
      return addTransaction(action.payload)
    default:
      throw new Error('StorageContext: An unexpected type of action was given.')
  }
}

const initialStorageState: TStorageState = {
  budgets: {}
}

export const StorageContext = createContext<TStorageContext>({
  ...initialStorageState,
  dispatch: () => {}
})

const StorageContextProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(storageReducer, initialStorageState)

  useEffect(() => {
    const fetchBudgets = async () => {
      const budgets = await Budget.findAll()
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
