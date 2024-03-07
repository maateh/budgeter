// context
import FormContext from "@/services/providers/form/FormContext"

type FormProviderProps = {
  cleanForm?: () => void
  cancelAction?: () => void
} & React.PropsWithChildren

const FormProvider = ({
  cleanForm = () => {},
  cancelAction = () => {},
  children
}: FormProviderProps) => {
  return (
    <FormContext.Provider value={{ cleanForm, cancelAction }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
