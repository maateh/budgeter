import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useCurrencies = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => await api.exchange.getCurrencies()
  })
}

export default useCurrencies
