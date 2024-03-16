import { Route, Routes } from "react-router-dom"

// layouts
import RootLayout from "@/_root/RootLayout"
import { Home, Transactions, Wishlist, Splitter, BudgetDetails } from "@/_root/pages"

import DialogLayout from "@/_dialogs/DialogLayout"
import AlertLayout from "@/_dialogs/AlertLayout"
import { BackupManager, Budgets, CreateTransaction, DeleteBudget, DeleteNote, DeleteTransaction, SaveBudget, TransactionDetails } from "@/_dialogs"

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
          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>

      {/* Additional components to be rendered on top of the actual page content */}
      {backgroundLocation && (
        <Routes>
          <Route path="/" element={<DialogLayout />}>
            <Route path="/budgets">
              <Route index element={<Budgets />} />
              <Route path="create" element={<SaveBudget type="create" />} />
              <Route path="edit/:id" element={<SaveBudget type="edit" />} />
            </Route>

            <Route path="/transactions">
              <Route path="create/:budgetId?" element={<CreateTransaction />} />
              <Route path=":id" element={<TransactionDetails />} />
            </Route>

            <Route path="/backups" element={<BackupManager />} />
          </Route>

          <Route path="/" element={<AlertLayout />}>
            <Route path="/budgets">
              <Route path="delete/:id" element={<DeleteBudget />} />
              <Route path=":budgetId/notes/delete/:id" element={<DeleteNote />} />
            </Route>
            <Route path="/transactions">
              <Route path="delete/:id" element={<DeleteTransaction />} />
            </Route>
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App

