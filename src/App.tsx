import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { lazily } from "react-lazily"

// layouts
import { RootLayout } from "@/_root/RootLayout"
const { Home, Transactions, Wishlist, Splitter, BudgetDetails, Backup } = lazily(() => import('@/_root'))

import { DialogLayout, DialogSkeleton } from "@/_dialogs/DialogLayout"
const { CreateTransaction, SaveBudget, TransactionDetails, TransferMoney } = lazily(() => import('@/_dialogs'))

import { AlertLayout, AlertSkeleton } from "@/_alerts/AlertLayout"
const { DeleteBudget, DeleteNote, DeleteTransaction, RestoreBackup } = lazily(() => import('@/_alerts'))

// shadcn
import { PageLoader } from "@/components/ui/skeleton"
const { Toaster } = lazily(() => import('@/components/ui/toaster'))

// hooks
import { useDialog } from "@/hooks"

const App = () => {
  const { location, backgroundLocation } = useDialog()

  return (
    <>
      {/* Pages */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={(
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          )} />

          <Route path="/budgets/:id" element={(
            <Suspense fallback={<PageLoader />}>
              <BudgetDetails />
            </Suspense>
          )} />

          <Route path="/transactions" element={(
            <Suspense fallback={<PageLoader />}>
              <Transactions />
            </Suspense>
          )} />

          <Route path="/wishlist" element={(
            <Suspense fallback={<PageLoader />}>
              <Wishlist />
            </Suspense>
          )} />

          <Route path="/splitter" element={(
            <Suspense fallback={<PageLoader />}>
              <Splitter />
            </Suspense>
          )} />

          <Route path="/backup/:budgetId?" element={(
            <Suspense fallback={<PageLoader />}>
              <Backup />
            </Suspense>
          )} />
          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>

      {/* Additional components to be rendered on top of the actual page content */}
      {backgroundLocation && (
        <Routes>
          <Route path="/" element={<DialogLayout />}>
            <Route path="/budgets">
              <Route path="create" element={(
                <Suspense fallback={<DialogSkeleton />}>
                  <SaveBudget />
                </Suspense>
              )} />

              <Route path="edit/:id" element={(
                <Suspense fallback={<DialogSkeleton />}>
                  <SaveBudget />
                </Suspense>
              )} />

              <Route path="transfer/:id" element={(
                <Suspense fallback={<DialogSkeleton />}>
                  <TransferMoney />
                </Suspense>
              )} />
            </Route>

            <Route path="/transactions">
              <Route path="create/:budgetId?" element={(
                <Suspense fallback={<DialogSkeleton />}>
                  <CreateTransaction />
                </Suspense>
              )} />

              <Route path="details/:id" element={(
                <Suspense fallback={<DialogSkeleton />}>
                  <TransactionDetails />
                </Suspense>
              )} />
            </Route>
          </Route>

          <Route path="/" element={<AlertLayout />}>
            <Route path="/budgets">
              <Route path="delete/:id" element={(
                <Suspense fallback={<AlertSkeleton />}>
                  <DeleteBudget />
                </Suspense>
              )} />

              <Route path=":budgetId/notes/delete/:id" element={(
                <Suspense fallback={<AlertSkeleton />}>
                  <DeleteNote />
                </Suspense>
              )} />
            </Route>

            <Route path="/transactions">
              <Route path="delete/:id" element={(
                <Suspense fallback={<AlertSkeleton />}>
                  <DeleteTransaction />
                </Suspense>
              )} />
            </Route>

            <Route path="/backup">
              <Route path="restore" element={(
                <Suspense fallback={<AlertSkeleton />}>
                  <RestoreBackup />
                </Suspense>
              )} />
            </Route>
          </Route>
        </Routes>
      )}

      <Suspense fallback={<>Loading...</>}> {/* TODO: add skeleton */}
        <Toaster />
      </Suspense>
    </>
  )
}

export default App
