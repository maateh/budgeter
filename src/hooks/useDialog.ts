import { NavigateOptions, To, useLocation, useNavigate } from "react-router-dom"

const useDialog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const backgroundLocation = location.state?.background as Location

  const openDialog = (to: To, options?: Omit<NavigateOptions, 'state'>) => {
    navigate(to, {
      ...options,
      state: { background: backgroundLocation || location }
    })
  }

  return { location, backgroundLocation, openDialog }
}

export default useDialog
