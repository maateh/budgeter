import { useContext } from "react"

// context
import FormContext from "@/services/providers/form/FormContext"

export const useFormContext = () => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('FormContext must be used within its own Provider!')
  }

  return context
}
