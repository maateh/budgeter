import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useLoadCurrenciesQuery = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['currencies'],
    queryFn: api.currency.get
  })
}

export default useLoadCurrenciesQuery
