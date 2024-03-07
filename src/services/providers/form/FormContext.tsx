import { createContext } from "react"

type FormContextType = {
  cleanForm: () => void,
  cancelAction: () => void
}

const FormContext = createContext<FormContextType>({
  cleanForm: () => {},
  cancelAction: () => {}
})

export default FormContext
