import { Outlet } from "react-router-dom"

// components
import Navbar from "@/components/shared/Navbar"

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main className="max-container">
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
