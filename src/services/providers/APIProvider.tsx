import { useState } from "react"

// api
import API from "@/services/api"

// context
import APIContext from "@/services/providers/APIContext"

type APIProviderProps = {
  type: 'storage' | 'remote'
  children: React.JSX.Element
}

const APIProvider = ({ type, children }: APIProviderProps) => {
  const [api, setApi] = useState(API.getInstance(type))
  
  const switchToStorage = () => {
    setApi(API.getInstance('storage'))
  }

  const switchToRemote = () => {
    setApi(API.getInstance('remote'))
  }

  return (
    <APIContext.Provider value={{ api, switchToStorage, switchToRemote }}>
      {children}
    </APIContext.Provider>
  )
}

export default APIProvider
