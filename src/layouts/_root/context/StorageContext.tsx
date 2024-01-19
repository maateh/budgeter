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
    budgets: budgets || []
  })

  const addBudget = ({ budget }: TStorageAction['payload']) => ({
    ...state,
    budgets: budget ? [
      ...state.budgets.filter(b => b.id !== budget.id),
      budget
    ] : state.budgets
  })

  const deleteBudget = ({ id }: TStorageAction['payload']) => ({
    ...state,
    budgets: state.budgets.filter(b => b.id !== id)
  })

  const addTransaction = ({ budget, transaction }: TStorageAction['payload']) => {
    const budgetIndex = state.budgets.findIndex(b => b.id === budget?.id)
    state.budgets[budgetIndex].executeTransactions([transaction])

    return state
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
  budgets: await Budget.findAll()
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
