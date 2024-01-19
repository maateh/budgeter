import { Outlet } from "react-router-dom"

// components
import Navbar from "@/components/shared/Navbar"

// context
import StorageContextProvider from "./context/StorageContextProvider"

const RootLayout = () => {
  return (
    <StorageContextProvider>
      <Navbar />
      <Outlet />
    </StorageContextProvider>
  )
}

export default RootLayout
