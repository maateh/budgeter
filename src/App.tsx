import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"

// layouts
import RootLayout from "./layouts/_root/RootLayout"
import { Home, Transactions, Wishlist } from "./layouts/_root/pages"

const App = () => {
  return (
    <main className="max-container">
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={
            <Suspense fallback={<>Loading...</>}>
              <Home />
            </Suspense>
          } />
          <Route path="/transactions" element={
            <Suspense fallback={<>Loading...</>}>
              <Transactions />
            </Suspense>
          } />
          <Route path="/wishlist" element={
            <Suspense fallback={<>Loading...</>}>
              <Wishlist />
            </Suspense>
          } />
        </Route>

        <Route path="*" element={
          <Suspense fallback={<>Loading...</>}>
            <p>Page not found!</p>
          </Suspense>
        } />
      </Routes>
    </main>
  )
}

export default App
