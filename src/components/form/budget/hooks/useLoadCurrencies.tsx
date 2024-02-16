import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useLoadCurrencies = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['currencies'],
    queryFn: api.currency.get
  })
}

export default useLoadCurrencies
