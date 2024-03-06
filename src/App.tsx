import { Route, Routes, useLocation } from "react-router-dom"

// layouts
import RootLayout from "@/layouts/_root/RootLayout"
import { Home, Transactions, Wishlist,Splitter, BudgetDetails } from "@/layouts/_root/pages"

// components
import BudgetCreateFormDialog from "@/components/form/budget/BudgetCreateFormDialog"
import BudgetEditFormDialog from "./components/form/budget/BudgetEditFormDialog"
import TransactionFormDialog from "./components/form/transaction/TransactionFormDialog"
import TransactionDetailsDialog from "@/components/shared/transaction/TransactionDetailsDialog"

const App = () => {
  const location = useLocation()
  const backgroundLocation = location.state?.background

  // TODO: load pages with lazy loading
  return (
    <>
      {/* Pages */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/budgets/:id" element={<BudgetDetails />}>
            <Route path="edit" element={<BudgetEditFormDialog />} />
          </Route>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/splitter" element={<Splitter />} />
          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>

      {/* Additional components to be rendered on top of the actual page content */}
      {backgroundLocation && (
        <Routes>
          <Route path="/budgets/create" element={<BudgetCreateFormDialog />} />
          <Route path="/transactions">
            <Route path="create" element={<TransactionFormDialog />} />
            <Route path=":id" element={<TransactionDetailsDialog />} />
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         index: true,
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <Home />
//           </Suspense>
//         )
//       },
//       {
//         path: "/budgets/:id",
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <BudgetDetails />
//           </Suspense>
//         )
//       },
//       {
//         path: "/transactions",
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <Transactions />
//           </Suspense>
//         )
//       },
//       {
//         path: "/splitter",
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <Splitter />
//           </Suspense>
//         )
//       },
//       {
//         path: "/wishlist",
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <Wishlist />
//           </Suspense>
//         )
//       },
//       {
//         path: "*",
//         element: (
//           <Suspense fallback={<>Loading...</>}>
//             <p>Page not found!</p>
//           </Suspense>
//         )
//       }
//     ]
//   }
// ])
