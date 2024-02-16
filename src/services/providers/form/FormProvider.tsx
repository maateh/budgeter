import { useState } from "react"

// context
import FormContext from "@/services/providers/form/FormContext"

type FormProviderProps = React.PropsWithChildren & {
  cleanForm?: () => void
}

const FormProvider = ({ cleanForm: defaultCleanForm = () => {}, children }: FormProviderProps) => {
  const [cleanForm, setCleanForm] = useState(() => defaultCleanForm)

  return (
    <FormContext.Provider value={{ cleanForm, setCleanForm }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
