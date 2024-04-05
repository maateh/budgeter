import { Route, Routes } from "react-router-dom"

// layouts
import RootLayout from "@/_root/RootLayout"
import { Home, Transactions, Wishlist, Splitter, BudgetDetails, Backup } from "@/_root/pages"

import DialogLayout from "@/_dialogs/DialogLayout"
import { Budgets, CreateTransaction, SaveBudget, TransactionDetails, TransferMoney } from "@/_dialogs"

import AlertLayout from "@/_alerts/AlertLayout"
import { DeleteBudget, DeleteNote, DeleteTransaction, RestoreBackup } from "@/_alerts"

// hooks
import { useDialog } from "@/hooks"

const App = () => {
  const { location, backgroundLocation } = useDialog()

  // TODO: load pages with lazy loading
  return (
    <>
      {/* Pages */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/budgets/:id" element={<BudgetDetails />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/splitter" element={<Splitter />} />
          <Route path="/backup/:budgetId?" element={<Backup />} />
          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>

      {/* Additional components to be rendered on top of the actual page content */}
      {backgroundLocation && (
        <Routes>
          <Route path="/" element={<DialogLayout />}>
            <Route path="/budgets">
              <Route index element={<Budgets />} />
              <Route path="create" element={<SaveBudget />} />
              <Route path="edit/:id" element={<SaveBudget />} />
              <Route path="transfer/:id" element={<TransferMoney />} />
            </Route>

            <Route path="/transactions">
              <Route path="create/:budgetId?" element={<CreateTransaction />} />
              <Route path="details/:id" element={<TransactionDetails />} />
            </Route>
          </Route>

          <Route path="/" element={<AlertLayout />}>
            <Route path="/budgets">
              <Route path="delete/:id" element={<DeleteBudget />} />
              <Route path=":budgetId/notes/delete/:id" element={<DeleteNote />} />
            </Route>
            <Route path="/transactions">
              <Route path="delete/:id" element={<DeleteTransaction />} />
            </Route>
            <Route path="/backup">
              <Route path="restore" element={<RestoreBackup />} />
            </Route>
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App
