import { Suspense } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

// layouts
import RootLayout from "./layouts/_root/RootLayout"
import { Home, Transactions, Wishlist, Splitter, BudgetDetails } from "./layouts/_root/pages"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "/transactions",
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Transactions />
          </Suspense>
        )
      },
      {
        path: "/splitter",
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Splitter />
          </Suspense>
        )
      },
      {
        path: "/wishlist",
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Wishlist />
          </Suspense>
        )
      },
      {
        path: "/budgets/:id",
        element: (
          <Suspense fallback={<>Loading...</>}>
            <BudgetDetails />
          </Suspense>
        )
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<>Loading...</>}>
            <p>Page not found!</p>
          </Suspense>
        )
      }
    ]
  }
])

const App = () => {
  return (
    <main className="max-container">
      <RouterProvider router={router} />
    </main>
  )
}

export default App
