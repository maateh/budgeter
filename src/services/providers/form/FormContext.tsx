import { createContext } from "react"

type FormContextType = {
  cleanForm: () => void,
  setCleanForm: React.Dispatch<React.SetStateAction<() => void>>
}

const FormContext = createContext<FormContextType>({
  cleanForm: () => () => {},
  setCleanForm: () => {}
})

export default FormContext
