import { Outlet } from "react-router-dom"

// components
import Navbar from "@/components/shared/Navbar"

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main className="px-2.5 max-container">
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
