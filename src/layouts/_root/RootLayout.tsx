import { Outlet } from "react-router-dom"

// components
import Navbar from "@/components/shared/Navbar"

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default RootLayout
